/**
 * Preview Server Middleware for Vite
 * 
 * NOTE: In React Router v7, this middleware is bypassed because React Router
 * routes (/api/preview) take precedence. The actual preview handling is done
 * by app/routes/api.preview.ts
 * 
 * This middleware is kept for:
 * - Preview token validation on ?preview=true requests
 * - Potential fallback if the route is disabled
 */

import type { ViteDevServer } from 'vite';
import type { IncomingMessage, ServerResponse } from 'http';
import { handlePreviewGet, handlePreviewPost, PreviewHandlerOptions } from './previewHandler';
import { generatePreviewToken, validatePreviewToken } from './previewToken';

export function setupPreviewServer(server: ViteDevServer, options: PreviewHandlerOptions = {}) {
  server.middlewares.use(async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    // Handle /api/preview endpoint
    if (req.url?.startsWith('/api/preview')) {
      await handlePreviewEndpoint(req, res, next, options);
      return;
    }

    // Validate preview token on all requests with ?preview=true
    if (req.url?.includes('preview=true')) {
      await validatePreviewRequest(req, res, next, options);
      return;
    }

    next();
  });
}

async function handlePreviewEndpoint(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void,
  options: PreviewHandlerOptions
) {
    if (!req.url) {
      return next();
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const method = req.method?.toLowerCase();

    // CORS headers for Uniform Canvas
    const allowedOrigins = [
      'https://uniform.app',
      'https://eu.uniform.app',
    ];

    const origin = req.headers.origin;
    const isAllowedOrigin = origin && allowedOrigins.some(allowed =>
      origin === allowed || origin.endsWith('.uniform.app')
    );

    const corsHeaders = {
      'Access-Control-Allow-Origin': isAllowedOrigin && origin ? origin : allowedOrigins[0],
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Credentials': 'true'
    };

    // Set CORS headers
    Object.entries(corsHeaders).forEach(([key, value]) => {
      if (value) {
        res.setHeader(key, value);
      }
    });

    // Handle OPTIONS preflight
    if (method === 'options') {
      res.statusCode = 204;
      res.end();
      return;
    }

    // Handle GET (preview activation)
    if (method === 'get') {
      const result = await handlePreviewGet(
        url, 
        new Headers(req.headers as any), 
        options,
        generatePreviewToken // Pass token generation function
      );

      res.statusCode = result.status;

      // Add CORS headers for all GET responses
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      // Set preview token cookie
      if (result.cookie) {
        res.setHeader('Set-Cookie', `${result.cookie.name}=${result.cookie.value}; ${result.cookie.options}`);
      }

      if (result.redirect) {
        res.setHeader('Location', result.redirect);
        res.end();
        return;
      }

      if (result.body) {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(result.body));
        return;
      }

      res.end();
      return;
    }

    // Handle POST (hot composition updates)
    if (method === 'post') {
      let body = '';
      req.on('data', (chunk: string | Buffer) => {
        body += chunk.toString();
      });

      req.on('end', () => {
        try {
          const parsedBody = JSON.parse(body);
          const url = new URL(req.url || '/', `http://${req.headers.host}`);
          const result = handlePreviewPost(url, req.headers as unknown as Headers, parsedBody, options);

          res.statusCode = result.status;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result.body));
        } catch (error) {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Invalid JSON body' }));
        }
      });

      return;
    }

  next();
}

/**
 * Validate preview token on all requests with ?preview=true
 * This prevents unauthorized access to draft content
 */
async function validatePreviewRequest(
  req: IncomingMessage,
  res: ServerResponse,
  next: () => void,
  options: PreviewHandlerOptions
): Promise<void> {
  if (!req.url) {
    return next();
  }
  
  const url = new URL(req.url, `http://${req.headers.host}`);
  
  // Get token from URL or cookie
  const tokenFromUrl = url.searchParams.get('previewToken');
  const tokenFromCookie = getCookieValue(req, '__uniform_preview_token');
  const token = tokenFromUrl || tokenFromCookie;
  
  if (!token) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Unauthorized</title>
        </head>
        <body style="font-family: system-ui; max-width: 600px; margin: 100px auto; text-align: center;">
          <h1>🔒 Preview Mode Unauthorized</h1>
          <p>You need a valid preview token to access draft content.</p>
          <p>Please open preview mode through Uniform Canvas.</p>
          <a href="/" style="color: #0066cc;">← Back to published site</a>
        </body>
      </html>
    `);
    return;
  }
  
  const secret = options.secret || process.env.UNIFORM_PREVIEW_SECRET;
  
  if (!secret) {
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'Preview secret not configured' }));
    return;
  }
  
  const isValid = await validatePreviewToken(token, secret);
  if (!isValid) {
    res.statusCode = 401;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Token Expired</title>
        </head>
        <body style="font-family: system-ui; max-width: 600px; margin: 100px auto; text-align: center;">
          <h1>⏰ Preview Token Expired</h1>
          <p>Your preview session has expired.</p>
          <p>Please refresh the preview from Uniform Canvas.</p>
          <a href="/" style="color: #0066cc;">← Back to published site</a>
        </body>
      </html>
    `    );
    return;
  }
  
  next();
}

function getCookieValue(req: IncomingMessage, name: string): string | null {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return null;
  
  const cookies = cookieHeader.split(';').map(c => c.trim());
  const cookie = cookies.find(c => c.startsWith(`${name}=`));
  
  return cookie ? cookie.substring(name.length + 1) : null;
}

