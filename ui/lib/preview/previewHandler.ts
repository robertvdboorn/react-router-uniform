import type { RootComponentInstance } from '@uniformdev/canvas';
import {
  generateHash,
  isAllowedReferrer,
  IN_CONTEXT_EDITOR_QUERY_STRING_PARAM,
  IN_CONTEXT_EDITOR_PLAYGROUND_QUERY_STRING_PARAM,
  SECRET_QUERY_STRING_PARAM,
  IN_CONTEXT_EDITOR_CONFIG_CHECK_QUERY_STRING_PARAM
} from '@uniformdev/canvas';

/**
 * Logger interface for type-safe logging
 * Matches the Logger class from app/lib/logger.server.ts
 */
export interface PreviewLogger {
  debug(message: string, context?: Record<string, any>): void;
  info(message: string, context?: Record<string, any>): void;
  warn(message: string, context?: Record<string, any>): void;
  error(message: string, error?: any, context?: Record<string, any>): void;
}

// Composition params that shouldn't be preserved in redirects
const COMPOSITION_PARAMS = ['id', 'slug', 'path', 'locale'];

// Preview token cookie name (needs to match previewToken.ts)
export const PREVIEW_TOKEN_COOKIE = '__uniform_preview_token';

/**
 * Possible response body types for preview handler
 */
export type PreviewResponseBody =
  | { hasPlayground: boolean; isUsingCustomFullPathResolver: boolean }  // Config check
  | { error: string }                                                    // Error response
  | { message: string }                                                  // POST error
  | { composition: RootComponentInstance }                               // POST success
  | undefined;                                                           // No body (redirects, etc.)

/**
 * Preview Handler Configuration
 */
export interface PreviewHandlerOptions {
  secret?: string;
  playgroundPath?: string;
}

export interface PreviewHandlerResult {
  status: number;
  redirect?: string;
  body?: PreviewResponseBody;
  cookie?: {
    name: string;
    value: string;
    options: string;
  };
}

/**
 * Handle GET requests for preview mode activation
 * This is called when you click "Preview" in Uniform Canvas
 * 
 * @param generateToken - Server-side only function to generate secure tokens
 * @param logger - Optional logger instance (falls back to console)
 */
export async function handlePreviewGet(
  url: URL,
  headers: Headers,
  options: PreviewHandlerOptions = {},
  generateToken?: (secret: string) => Promise<string>,
  logger?: PreviewLogger
): Promise<PreviewHandlerResult> {
  const { secret, playgroundPath } = options;

  // Log incoming preview request (fallback to console if no logger provided)
  const log: PreviewLogger = logger || {
    debug: (msg: string, ctx?: any) => console.log(`[DEBUG] ${msg}`, ctx || ''),
    info: (msg: string, ctx?: any) => console.log(`[INFO] ${msg}`, ctx || ''),
    warn: (msg: string, ctx?: any) => console.warn(`[WARN] ${msg}`, ctx || ''),
    error: (msg: string, err?: any, ctx?: any) => console.error(`[ERROR] ${msg}`, err, ctx || ''),
  };
  log.info('PREVIEW GET: Incoming request', {
    pathname: url.pathname,
    searchParams: Object.fromEntries(url.searchParams.entries()),
    referer: headers.get('referer'),
    origin: headers.get('origin'),
    fetchMode: headers.get('sec-fetch-mode'),
    userAgent: headers.get('user-agent')?.substring(0, 100), // Truncate for logs
  });

  // Config check: Canvas queries this to detect playground support
  const isConfigCheck = url.searchParams.get(IN_CONTEXT_EDITOR_CONFIG_CHECK_QUERY_STRING_PARAM) === 'true';
  if (isConfigCheck) {
    log.info('PREVIEW GET: Config check', {
      hasPlayground: Boolean(playgroundPath),
      playgroundPath,
    });
    return {
      status: 200,
      body: {
        hasPlayground: Boolean(playgroundPath),
        isUsingCustomFullPathResolver: false
      }
    };
  }

  // No-cors preflight: Canvas sends this to validate the preview URL
  const fetchMode = headers.get('sec-fetch-mode');
  if (fetchMode === 'no-cors') {
    log.debug('PREVIEW GET: No-cors preflight');
    return { status: 204 };
  }

  let requestSecret = url.searchParams.get(SECRET_QUERY_STRING_PARAM);
  const expectedSecret = secret || process.env.UNIFORM_PREVIEW_SECRET;

  // Fix: URL decoding converts + to space, so we need to normalize
  // Base64 secrets use + but URL decoding converts them to spaces
  if (requestSecret && requestSecret.includes(' ')) {
    const originalSecret = requestSecret;
    requestSecret = requestSecret.replace(/ /g, '+');
    log.debug('PREVIEW GET: Normalized secret (space to +)', {
      hadSpaces: originalSecret.includes(' '),
      spaceCount: (originalSecret.match(/ /g) || []).length,
      originalPrefix: originalSecret.substring(0, 20),
      normalizedPrefix: requestSecret.substring(0, 20),
    });
  }

  // Log secret validation (without exposing actual secrets)
  log.info('PREVIEW GET: Secret validation', {
    hasRequestSecret: Boolean(requestSecret),
    requestSecretLength: requestSecret?.length || 0,
    requestSecretPrefix: requestSecret?.substring(0, 4) || 'none',
    hasExpectedSecret: Boolean(expectedSecret),
    expectedSecretLength: expectedSecret?.length || 0,
    expectedSecretPrefix: expectedSecret?.substring(0, 4) || 'none',
    secretsMatch: requestSecret === expectedSecret,
    env: process.env.NODE_ENV,
  });

  // Debug: Character-by-character comparison to find exact mismatch
  if (requestSecret && expectedSecret && requestSecret !== expectedSecret) {
    const maxLen = Math.max(requestSecret.length, expectedSecret.length);
    let firstDiffIndex = -1;
    
    for (let i = 0; i < maxLen; i++) {
      if (requestSecret[i] !== expectedSecret[i]) {
        firstDiffIndex = i;
        break;
      }
    }
    
    if (firstDiffIndex >= 0) {
      const contextStart = Math.max(0, firstDiffIndex - 5);
      const contextEnd = Math.min(maxLen, firstDiffIndex + 6);
      
      log.debug('PREVIEW GET: Secret character mismatch', {
        firstDiffIndex,
        requestChar: requestSecret[firstDiffIndex],
        requestCharCode: requestSecret.charCodeAt(firstDiffIndex),
        expectedChar: expectedSecret[firstDiffIndex],
        expectedCharCode: expectedSecret.charCodeAt(firstDiffIndex),
        requestContext: requestSecret.substring(contextStart, contextEnd),
        expectedContext: expectedSecret.substring(contextStart, contextEnd),
        requestHasSpace: requestSecret.includes(' '),
        expectedHasSpace: expectedSecret.includes(' '),
        requestHasPlus: requestSecret.includes('+'),
        expectedHasPlus: expectedSecret.includes('+'),
      });
    }
  }

  if (!expectedSecret) {
    log.error('PREVIEW GET: Preview secret not configured');
    return { status: 500, body: { error: 'Preview secret not configured' } };
  }

  // Handle disable preview mode (exit preview)
  if (url.searchParams.has('disable')) {
    const path = url.searchParams.get('path') || url.searchParams.get('slug') || '/';
    log.info('PREVIEW GET: Disabling preview', { redirectTo: path });
    return { status: 302, redirect: path };
  }

  // Validate secret token
  if (requestSecret !== expectedSecret) {
    log.warn('PREVIEW GET: Invalid token', {
      receivedLength: requestSecret?.length || 0,
      expectedLength: expectedSecret.length,
      receivedPrefix: requestSecret?.substring(0, 4) || 'none',
      expectedPrefix: expectedSecret.substring(0, 4),
    });
    return { status: 401, body: { error: 'Invalid token' } };
  }

  // Determine target path
  const isPlayground = url.searchParams.get(IN_CONTEXT_EDITOR_PLAYGROUND_QUERY_STRING_PARAM) === 'true';
  let pathToRedirectTo: string;

  if (isPlayground && playgroundPath) {
    pathToRedirectTo = playgroundPath;
  } else {
    pathToRedirectTo = url.searchParams.get('path') || url.searchParams.get('slug') || '/';
  }

  log.info('PREVIEW GET: Target path determined', {
    isPlayground,
    playgroundPath,
    pathToRedirectTo,
  });

  // Build redirect URL
  const redirectUrl = new URL(pathToRedirectTo, url.origin);

  // Extract composition ID for direct fetching (bypasses project map)
  const compositionId = url.searchParams.get('id');

  // Preserve query params except secret (but keep composition params for direct fetching)
  url.searchParams.forEach((value, key) => {
    if (key === SECRET_QUERY_STRING_PARAM) return;
    // Keep composition ID for direct fetching
    if (key === 'id' && compositionId) {
      redirectUrl.searchParams.set('compositionId', compositionId);
      return;
    }
    // Skip other composition params
    if (COMPOSITION_PARAMS.includes(key)) return;
    redirectUrl.searchParams.set(key, value);
  });

  // Validate contextual editing mode
  const referer = headers.get('referer') || undefined;
  const isUniformContextualEditing =
    url.searchParams.get(IN_CONTEXT_EDITOR_QUERY_STRING_PARAM) === 'true' &&
    isAllowedReferrer(referer);

  log.info('PREVIEW GET: Contextual editing validation', {
    referer,
    hasContextualEditingParam: url.searchParams.get(IN_CONTEXT_EDITOR_QUERY_STRING_PARAM) === 'true',
    isAllowedReferer: referer ? isAllowedReferrer(referer) : false,
    isUniformContextualEditing,
  });

  // Remove Canvas params if not valid contextual editing
  if (!isUniformContextualEditing) {
    redirectUrl.searchParams.delete(IN_CONTEXT_EDITOR_QUERY_STRING_PARAM);
    redirectUrl.searchParams.delete(IN_CONTEXT_EDITOR_PLAYGROUND_QUERY_STRING_PARAM);
  }

  // Generate secure preview token (if function provided - server-side only)
  let previewToken = '';
  if (generateToken) {
    try {
      previewToken = await generateToken(expectedSecret);
      log.info('PREVIEW GET: Token generated', {
        tokenLength: previewToken.length,
        tokenPrefix: previewToken.substring(0, 8),
      });
    } catch (error) {
      log.error('PREVIEW GET: Token generation failed', error);
    }
  } else {
    log.warn('PREVIEW GET: No token generator provided (client-side or missing)');
  }
  
  // Add preview flag
  redirectUrl.searchParams.set('preview', 'true');
  if (previewToken) {
    redirectUrl.searchParams.set('previewToken', previewToken);
  }

  // Set secure cookie with the token
  const cookieOptions = [
    `Path=/`,
    `HttpOnly`,
    `SameSite=Strict`,
    `Max-Age=${24 * 60 * 60}`, // 24 hours
    // Only set Secure in production
    process.env.NODE_ENV === 'production' ? 'Secure' : ''
  ].filter(Boolean).join('; ');

  const redirectPath = redirectUrl.pathname + redirectUrl.search;

  log.info('PREVIEW GET: Redirect prepared', {
    redirectPath,
    hasToken: Boolean(previewToken),
    cookieWillBeSet: Boolean(previewToken),
    queryParams: Object.fromEntries(redirectUrl.searchParams.entries()),
  });

  const result: PreviewHandlerResult = {
    status: 307,
    redirect: redirectPath
  };

  // Only set cookie if we have a token
  if (previewToken) {
    result.cookie = {
      name: PREVIEW_TOKEN_COOKIE,
      value: previewToken,
      options: cookieOptions
    };
  }

  return result;
}

/**
 * Handle POST requests for hot composition updates
 * This is called when you make changes in Uniform Canvas for live preview
 * 
 * @param logger - Optional logger instance (falls back to console)
 */
export function handlePreviewPost(
  url: URL,
  headers: Headers,
  body: { composition?: RootComponentInstance; hash?: string },
  options: PreviewHandlerOptions = {},
  logger?: PreviewLogger
): { status: number; body: PreviewResponseBody } {
  const { secret } = options;
  const { composition, hash } = body;

  // Log incoming hot update (fallback to console if no logger provided)
  const log: PreviewLogger = logger || {
    debug: (msg: string, ctx?: any) => console.log(`[DEBUG] ${msg}`, ctx || ''),
    info: (msg: string, ctx?: any) => console.log(`[INFO] ${msg}`, ctx || ''),
    warn: (msg: string, ctx?: any) => console.warn(`[WARN] ${msg}`, ctx || ''),
    error: (msg: string, err?: any, ctx?: any) => console.error(`[ERROR] ${msg}`, err, ctx || ''),
  };
  log.info('PREVIEW POST: Incoming hot update', {
    pathname: url.pathname,
    hasComposition: Boolean(composition),
    compositionId: composition?.['_id'],
    compositionType: composition?.type,
    hasHash: Boolean(hash),
    hashPrefix: hash?.substring(0, 8),
    referer: headers.get('referer'),
    origin: headers.get('origin'),
  });

  if (!composition) {
    log.warn('PREVIEW POST: Missing composition parameter');
    return {
      status: 422,
      body: { message: 'Missing "composition" parameter' }
    };
  }

  const previewSecret = secret || process.env.UNIFORM_PREVIEW_SECRET;
  const hasProvidedHash = Boolean(hash);
  const hasConfiguredSecret = Boolean(previewSecret);

  log.info('PREVIEW POST: Hash validation', {
    hasProvidedHash,
    hasConfiguredSecret,
    hashLength: hash?.length || 0,
  });

  // Validate hash if both are provided
  if (hasProvidedHash && hasConfiguredSecret) {
    const calculatedHash = generateHash({
      composition,
      secret: previewSecret
    });

    log.debug('PREVIEW POST: Hash comparison', {
      providedHashPrefix: hash?.substring(0, 8),
      calculatedHashPrefix: calculatedHash ? calculatedHash.toString().substring(0, 8) : 'none',
      hashesMatch: calculatedHash === hash,
    });

    if (calculatedHash !== hash) {
      log.warn('PREVIEW POST: Hash mismatch - not authorized');
      return {
        status: 401,
        body: { message: 'Not authorized' }
      };
    }
  } else if (hasConfiguredSecret && !hasProvidedHash) {
    log.warn('PREVIEW POST: Secret configured but no hash provided - not authorized');
    return {
      status: 401,
      body: { message: 'Not authorized' }
    };
  }

  log.info('PREVIEW POST: Composition update accepted', {
    compositionId: composition['_id'],
    compositionType: composition.type,
  });

  return {
    status: 200,
    body: { composition }
  };
}

// Client-side preview detection functions have been moved to PreviewContext.tsx
// to avoid importing this file (which can pull in server-only dependencies) on the client

