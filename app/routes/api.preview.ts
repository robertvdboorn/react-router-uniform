import type { Route } from "./+types/api.preview";
import { handlePreviewGet, handlePreviewPost } from "@/lib/preview/previewHandler";
import { generatePreviewToken } from "@/lib/preview/previewToken";
import { getPreviewRateLimiter, getClientIdentifier } from "~/lib/redis.server";
import { logger } from "~/lib/logger.server";
import { 
  getCorsHeaders, 
  setSecureCookie, 
  PREVIEW_COOKIE_OPTIONS,
  sanitizeRedirectUrl,
  isValidUniformReferer,
} from "~/lib/security.server";

/**
 * API Route: /api/preview
 * 
 * Handles preview mode activation for Uniform Canvas contextual editing.
 * 
 * SECURITY:
 * - Rate limited: 60 requests per 60 seconds per IP (1 req/sec average)
 * - Preview secret validation
 * - Redis-backed token storage
 * 
 * GET: Activates preview mode and redirects to the composition path
 * POST: Receives composition updates during contextual editing
 */

/**
 * Handle GET/OPTIONS requests - Preview mode activation
 * Called when clicking "Preview" in Uniform Canvas
 */
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const headers = request.headers;
  
  logger.debug('PREVIEW API: Request received', { 
    method: request.method, 
    path: url.pathname + url.search 
  });
  
  // Handle CORS preflight (OPTIONS)
  if (request.method === 'OPTIONS') {
    logger.debug('PREVIEW API: Handling CORS preflight');
    const corsHeaders = getCorsHeaders(request);
    
    if (!corsHeaders) {
      return new Response(null, { status: 403 });
    }
    
    return new Response(null, {
      status: 204,
      headers: corsHeaders,
    });
  }
  
  // Rate limiting: Prevent brute-force attacks on preview secret
  try {
    const rateLimiter = getPreviewRateLimiter();
    const identifier = getClientIdentifier(request);
    const { success, limit, remaining, reset } = await rateLimiter.limit(identifier);
    
    if (!success) {
      logger.warn('PREVIEW API: Rate limit exceeded', { identifier });
      return new Response(
        JSON.stringify({ 
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((reset - Date.now()) / 1000)
        }), 
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': new Date(reset).toISOString(),
            'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }
  } catch (error) {
    // Rate limiter not configured (Redis unavailable) - continue without rate limiting
    logger.warn('PREVIEW API: Rate limiter unavailable, proceeding without rate limiting');
  }
  
  const result = await handlePreviewGet(
    url,
    headers,
    {
      secret: process.env.UNIFORM_PREVIEW_SECRET || 'hello-world',
      playgroundPath: '/uniform-playground',
    },
    generatePreviewToken,
    logger
  );
  
  logger.debug('PREVIEW API: Result', { 
    status: result.status, 
    hasRedirect: !!result.redirect, 
    hasCookie: !!result.cookie 
  });

  // Log 401 errors specifically for debugging
  if (result.status === 401) {
    logger.error('PREVIEW API: Unauthorized (401) - Invalid token', {
      body: result.body,
      searchParams: Object.fromEntries(url.searchParams.entries()),
      referer: headers.get('referer'),
      origin: headers.get('origin'),
      ip: getClientIdentifier(request),
      env: process.env.NODE_ENV,
      hasSecretEnv: Boolean(process.env.UNIFORM_PREVIEW_SECRET),
      secretLength: process.env.UNIFORM_PREVIEW_SECRET?.length || 0,
    });
  }

  // Validate referer for security (Uniform Canvas requests)
  const referer = headers.get('referer');
  if (referer && !isValidUniformReferer(referer)) {
    logger.security('preview_invalid_referer', {
      referer,
      ip: getClientIdentifier(request),
    }, 'warn');
  }
  
  // Apply CORS headers
  const corsHeaders = getCorsHeaders(request);
  const baseHeaders: Record<string, string> = corsHeaders || {};

  // Handle redirect
  if (result.redirect) {
    // Sanitize redirect URL to prevent open redirect
    const sanitizedRedirect = sanitizeRedirectUrl(result.redirect, url.origin);
    
    const response = new Response(null, {
      status: result.status,
      headers: {
        ...baseHeaders,
        Location: sanitizedRedirect,
      },
    });

    // Set preview token cookie with secure attributes
    if (result.cookie) {
      const secureCookie = setSecureCookie(
        result.cookie.name,
        result.cookie.value,
        PREVIEW_COOKIE_OPTIONS
      );
      response.headers.append('Set-Cookie', secureCookie);
      
      // Log preview activation for audit trail
      logger.security('preview_activated', {
        ip: getClientIdentifier(request),
        path: sanitizedRedirect,
      });
    }

    return response;
  }

  // Handle 204 No Content (must have no body)
  if (result.status === 204) {
    return new Response(null, {
      status: 204,
      headers: baseHeaders,
    });
  }

  // Handle JSON response
  return new Response(JSON.stringify(result.body || {}), {
    status: result.status,
    headers: {
      ...baseHeaders,
      'Content-Type': 'application/json',
    },
  });
}

/**
 * Handle POST requests - Composition updates during editing
 * Called when making changes in Uniform Canvas
 */
export async function action({ request }: Route.ActionArgs) {
  const url = new URL(request.url);
  const headers = request.headers;
  
  logger.debug('PREVIEW API: POST request received', { 
    path: url.pathname + url.search 
  });
  
  // Rate limiting for POST requests too
  try {
    const rateLimiter = getPreviewRateLimiter();
    const identifier = getClientIdentifier(request);
    const { success, limit, remaining, reset } = await rateLimiter.limit(identifier);
    
    if (!success) {
      logger.warn('PREVIEW API: Rate limit exceeded (POST)', { identifier });
      return new Response(
        JSON.stringify({ 
          error: 'Too many requests. Please try again later.',
          retryAfter: Math.ceil((reset - Date.now()) / 1000)
        }), 
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'X-RateLimit-Limit': limit.toString(),
            'X-RateLimit-Remaining': remaining.toString(),
            'X-RateLimit-Reset': new Date(reset).toISOString(),
            'Retry-After': Math.ceil((reset - Date.now()) / 1000).toString(),
          },
        }
      );
    }
  } catch (error) {
    logger.warn('PREVIEW API: Rate limiter unavailable, proceeding without rate limiting');
  }
  
  let body: any = {};

  try {
    body = await request.json();
  } catch (error) {
    logger.error('PREVIEW API: Failed to parse POST body', error);
  }

  // Validate referer for security
  const referer = headers.get('referer');
  if (!referer || !isValidUniformReferer(referer)) {
    logger.security('preview_post_invalid_referer', {
      referer: referer || 'none',
      ip: getClientIdentifier(request),
    }, 'warn');
    
    return new Response(
      JSON.stringify({ error: 'Invalid request origin' }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
  
  // Apply CORS headers
  const corsHeaders = getCorsHeaders(request);
  
  const result = handlePreviewPost(url, headers, body, {
    secret: process.env.UNIFORM_PREVIEW_SECRET || 'hello-world',
  }, logger);
  
  logger.debug('PREVIEW API: POST result', { status: result.status });
  
  // Log composition updates for audit
  if (result.status === 200) {
    logger.security('preview_composition_updated', {
      ip: getClientIdentifier(request),
    });
  }

  return new Response(JSON.stringify(result.body || {}), {
    status: result.status,
    headers: {
      ...(corsHeaders || {}),
      'Content-Type': 'application/json',
    },
  });
}
