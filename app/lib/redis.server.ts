import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

/**
 * Upstash Redis Client (Server-Only)
 * 
 * Uses HTTP REST API instead of TCP connections.
 * Perfect for serverless deployments and traditional Node.js servers.
 * 
 * Environment Variables Required:
 * - UPSTASH_REDIS_REST_URL
 * - UPSTASH_REDIS_REST_TOKEN
 */

// Singleton Redis client
let redis: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redis) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;

    if (!url || !token) {
      throw new Error(
        '❌ Missing Upstash Redis credentials:\n' +
        '  - UPSTASH_REDIS_REST_URL\n' +
        '  - UPSTASH_REDIS_REST_TOKEN\n' +
        'Get them from: https://console.upstash.com/'
      );
    }

    redis = new Redis({ url, token });
  }

  return redis;
}

/**
 * Rate Limiter for Preview API
 * 
 * Strategy: Sliding window with 60 requests per 60 seconds per IP (1 req/sec average)
 * Prevents brute-force attacks on preview secret while allowing smooth editing workflow
 */
let previewRateLimiter: Ratelimit | null = null;

export function getPreviewRateLimiter(): Ratelimit {
  if (!previewRateLimiter) {
    const redis = getRedisClient();
    
    previewRateLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(60, '60 s'),
      analytics: true, // Track rate limit analytics in Upstash dashboard
      prefix: '@ratelimit/preview',
    });
  }

  return previewRateLimiter;
}

/**
 * Rate Limiter for General API Routes
 * 
 * More permissive: 180 requests per 60 seconds per IP (3 req/sec average)
 */
let apiRateLimiter: Ratelimit | null = null;

export function getApiRateLimiter(): Ratelimit {
  if (!apiRateLimiter) {
    const redis = getRedisClient();
    
    apiRateLimiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(180, '60 s'),
      analytics: true,
      prefix: '@ratelimit/api',
    });
  }

  return apiRateLimiter;
}

/**
 * Helper: Extract client identifier (IP address or fallback)
 */
export function getClientIdentifier(request: Request): string {
  // Try to get real IP from various headers
  const forwardedFor = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  // Use first forwarded IP (before any proxies)
  if (forwardedFor) {
    const ips = forwardedFor.split(',').map(ip => ip.trim()).filter(Boolean);
    if (ips.length > 0) return ips[0]!; // Safe: length check ensures element exists
  }
  
  if (realIp) return realIp;
  if (cfConnectingIp) return cfConnectingIp;
  
  // Fallback for local development
  return 'unknown';
}
