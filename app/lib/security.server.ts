/**
 * Security Utilities for Production
 * 
 * Implements security best practices:
 * - Secure cookie attributes
 * - Security headers (Helmet.js alternative)
 * - CSRF protection
 * - Request validation
 */

import { serialize } from 'cookie';
import { CookieSerializeOptions } from 'react-router';

/**
 * Secure Cookie Configuration
 * 
 * Implements OWASP recommendations for cookie security
 */
export const SECURE_COOKIE_OPTIONS: CookieSerializeOptions = {
  httpOnly: true, // Prevents XSS access to cookies
  secure: process.env.NODE_ENV === 'production', // HTTPS only in production
  sameSite: 'lax', // Prevents CSRF (strict would break OAuth flows)
  path: '/',
  maxAge: 60 * 60 * 24, // 24 hours
};

/**
 * Preview Cookie Options (more restrictive)
 */
export const PREVIEW_COOKIE_OPTIONS: CookieSerializeOptions = {
  ...SECURE_COOKIE_OPTIONS,
  sameSite: 'strict', // Stricter for preview tokens
  maxAge: 60 * 60 * 24, // 24 hours
};

/**
 * Set a secure cookie
 */
export function setSecureCookie(
  name: string,
  value: string,
  options: CookieSerializeOptions = SECURE_COOKIE_OPTIONS
): string {
  return serialize(name, value, {
    ...SECURE_COOKIE_OPTIONS,
    ...options,
  });
}

/**
 * Security Headers (Helmet.js alternative for React Router)
 * 
 * Based on OWASP Secure Headers Project
 * https://owasp.org/www-project-secure-headers/
 */
export function getSecurityHeaders(): Record<string, string> {
  // Note: X-Frame-Options is NOT set here to allow Uniform Canvas preview
  // Use CSP frame-ancestors instead (more flexible and modern)
  // If you enable CSP, it will properly control frame embedding
  return {
    // Prevent MIME type sniffing
    'X-Content-Type-Options': 'nosniff',
    
    // Enable XSS protection (legacy browsers)
    'X-XSS-Protection': '1; mode=block',
    
    // Referrer policy (balance privacy and functionality)
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Permissions policy (restrict powerful features)
    'Permissions-Policy': 
      'camera=(), microphone=(), geolocation=(), interest-cohort=()',
    
    // Strict Transport Security (HTTPS only)
    ...(process.env.NODE_ENV === 'production' && {
      'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    }),
  };
}

/**
 * Content Security Policy
 * 
 * IMPORTANT: This is a starting point. Adjust based on your needs.
 * Test thoroughly in development before enabling in production!
 */
export function getContentSecurityPolicy(): string {
  const directives: Record<string, string[]> = {
    // Default: Only same origin
    'default-src': ["'self'"],
    
    // Scripts: Self + inline (needed for React hydration) + Uniform
    'script-src': [
      "'self'",
      "'unsafe-inline'", // React hydration requires this
      'https://*.uniform.app',
      'https://fonts.googleapis.com',
    ],
    
    // Styles: Self + inline (Tailwind) + Google Fonts
    'style-src': [
      "'self'",
      "'unsafe-inline'", // Tailwind requires this
      'https://fonts.googleapis.com',
    ],
    
    // Images: Self + data URIs + common CDNs
    'img-src': [
      "'self'",
      'data:',
      'blob:',
      'https:', // Allow all HTTPS images (Uniform assets can be anywhere)
    ],
    
    // Fonts: Self + Google Fonts
    'font-src': [
      "'self'",
      'data:',
      'https://fonts.gstatic.com',
    ],
    
    // Connect: Self + Uniform API
    'connect-src': [
      "'self'",
      'https://*.uniform.app',
      'https://uniform.app',
      'https://eu.uniform.app',
    ],
    
    // Frames: Uniform Canvas for preview mode
    'frame-ancestors': [
      "'self'",
      'https://*.uniform.app',
      'https://uniform.app',
      'https://eu.uniform.app',
    ],
    
    // Object/Embed: Disabled
    'object-src': ["'none'"],
    
    // Base URI: Self only
    'base-uri': ["'self'"],
    
    // Form actions: Self only
    'form-action': ["'self'"],
    
    // Upgrade insecure requests in production
    ...(process.env.NODE_ENV === 'production' && {
      'upgrade-insecure-requests': [],
    }),
  };

  // Convert to CSP string
  return Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ');
}

/**
 * CORS Configuration
 * 
 * Only allow Uniform Canvas and your own domain
 */
export function getCorsHeaders(request: Request): Record<string, string> | null {
  const origin = request.headers.get('origin');
  
  const allowedOrigins = [
    'https://uniform.app',
    'https://eu.uniform.app',
    'https://app.uniform.app',
    'https://eu-app.uniform.app',
    ...(process.env.ALLOWED_ORIGINS?.split(',') || []),
  ];
  
  // Check if origin is allowed
  const isAllowed = origin && (
    allowedOrigins.includes(origin) ||
    origin.endsWith('.uniform.app') ||
    // Allow same origin
    new URL(request.url).origin === origin
  );
  
  if (!isAllowed) {
    return null;
  }
  
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400', // 24 hours
  };
}

/**
 * Validate Uniform Canvas Referer
 * 
 * Ensures requests are coming from legitimate Uniform Canvas
 */
export function isValidUniformReferer(referer: string | null): boolean {
  if (!referer) return false;
  
  try {
    const url = new URL(referer);
    return (
      url.hostname === 'uniform.app' ||
      url.hostname === 'eu.uniform.app' ||
      url.hostname === 'app.uniform.app' ||
      url.hostname === 'eu-app.uniform.app' ||
      url.hostname.endsWith('.uniform.app')
    );
  } catch {
    return false;
  }
}

/**
 * Sanitize redirect URLs
 * 
 * Prevents open redirect vulnerabilities
 */
export function sanitizeRedirectUrl(url: string, baseUrl: string): string {
  try {
    const parsed = new URL(url, baseUrl);
    const base = new URL(baseUrl);
    
    // Only allow same-origin redirects
    if (parsed.origin !== base.origin) {
      console.warn(`Blocked redirect to different origin: ${parsed.origin}`);
      return '/';
    }
    
    return parsed.pathname + parsed.search + parsed.hash;
  } catch {
    console.warn(`Invalid redirect URL: ${url}`);
    return '/';
  }
}

/**
 * Generate CSRF Token
 * 
 * Simple HMAC-based CSRF token generation
 */
export async function generateCsrfToken(secret: string, sessionId: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${sessionId}.${Date.now()}`);
  const key = encoder.encode(secret);
  
  // Use Web Crypto API (available in Node.js 15+)
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, data);
  const token = Buffer.from(signature).toString('base64url');
  
  return `${sessionId}.${Date.now()}.${token}`;
}

/**
 * Validate CSRF Token
 * 
 * Verifies CSRF token matches expected format and signature
 */
export async function validateCsrfToken(
  token: string | null,
  secret: string,
  sessionId: string,
  maxAge = 3600000 // 1 hour
): Promise<boolean> {
  if (!token) return false;
  
  try {
    const [tokenSessionId, timestamp, signature] = token.split('.');
    
    if (!tokenSessionId || !timestamp || !signature) return false;
    
    // Verify session ID matches
    if (tokenSessionId !== sessionId) return false;
    
    // Verify token isn't expired
    const tokenTime = parseInt(timestamp, 10);
    if (Date.now() - tokenTime > maxAge) return false;
    
    // Verify signature
    const expectedToken = await generateCsrfToken(secret, sessionId);
    const [, , expectedSignature] = expectedToken.split('.');
    
    return signature === expectedSignature;
  } catch {
    return false;
  }
}

/**
 * Input Sanitization
 * 
 * Basic sanitization for user inputs
 */
export function sanitizeString(input: string, maxLength = 1000): string {
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, ''); // Remove potential HTML tags
}

/**
 * Validate UUID format
 */
export function isValidUuid(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Check if IP is in allowlist (optional security layer)
 * 
 * Usage: Set ALLOWED_IPS="1.2.3.4,5.6.7.8" in env
 */
export function isIpAllowed(ip: string): boolean {
  const allowedIps = process.env.ALLOWED_IPS?.split(',').map(s => s.trim()) || [];
  
  // If no allowlist, allow all
  if (allowedIps.length === 0) return true;
  
  return allowedIps.includes(ip);
}

/**
 * Audit Log Helper
 * 
 * Log security events for monitoring
 * @deprecated Use logger.security() instead
 */
export function logSecurityEvent(
  event: string,
  data: Record<string, any>,
  level: 'info' | 'warn' | 'error' = 'info'
) {
  // Re-export for backwards compatibility
  const { logger } = require('./logger.server');
  logger.security(event, data, level);
}
