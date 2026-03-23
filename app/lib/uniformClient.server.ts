import { RouteClient, CanvasClient } from '@uniformdev/canvas';
import type { RootComponentInstance } from '@uniformdev/canvas';
import { getRequiredEnv } from './validateEnv.server';
import { logger } from './logger.server';

/**
 * Server-side Uniform Route Client
 * 
 * Uses process.env (server-side) instead of import.meta.env (client-side)
 * This keeps API keys SECURE - never exposed to the browser!
 * 
 * Now with environment validation - will throw if required vars are missing.
 */
export const uniformRouteClient = new RouteClient({
  apiKey: getRequiredEnv('UNIFORM_API_KEY'),
  projectId: getRequiredEnv('UNIFORM_PROJECT_ID'),
  edgeApiHost: process.env.UNIFORM_CLI_BASE_EDGE_URL || '',
});

/**
 * Server-side Uniform Canvas Client
 * 
 * For fetching compositions directly by ID
 */
export const uniformCanvasClient = new CanvasClient({
  apiKey: getRequiredEnv('UNIFORM_API_KEY'),
  projectId: getRequiredEnv('UNIFORM_PROJECT_ID'),
  apiHost: process.env.UNIFORM_CLI_BASE_URL || '',
  edgeApiHost: process.env.UNIFORM_CLI_BASE_EDGE_URL || '',
});

/**
 * Fetch a Uniform composition by path (server-side)
 * 
 * @param path - URL path (e.g., "/", "/about")
 * @returns Composition data or null if not found
 */
export async function fetchComposition(
  path: string
): Promise<RootComponentInstance | null> {
  try {
    const result = await uniformRouteClient.getRoute({ 
      path, 
      locale: 'en-US',
    });

    if (result.type === 'composition' && result.compositionApiResponse.composition) {
      return result.compositionApiResponse.composition;
    }

    return null;
  } catch (error) {
    logger.error(`Failed to fetch composition for path: ${path}`, error);
    return null;
  }
}

/**
 * Fetch a composition by its ID (server-side)
 * 
 * Used when we have a direct composition ID (e.g., from preview URL)
 * This bypasses project map resolution
 * 
 * @param compositionId - UUID of the composition
 * @param options - Fetch options (locale, state)
 * @returns Composition data or null if not found
 */
export async function fetchCompositionById(
  compositionId: string,
  options: { locale?: string; state?: any } = {}
): Promise<RootComponentInstance | null> {
  try {
    const { composition } = await uniformCanvasClient.getCompositionById({
      compositionId: compositionId,
      locale: options.locale || 'en-US',
      state: options.state,
    });

    return composition || null;
  } catch (error) {
    logger.error(`Failed to fetch composition by ID (${compositionId})`, error);
    return null;
  }
}

