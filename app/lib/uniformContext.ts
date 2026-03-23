import {
  Context,
  ManifestV2,
  ContextPlugin,
  enableContextDevTools,
} from "@uniformdev/context";
import { RouterCookieTransitionDataStore } from "./RouterCookieTransitionDataStore";
import manifest from "./contextManifest.json";
import "./uniformContext.types"; // Import type definitions

/**
 * UNIFORM CLIENT: Browser Context Singleton
 * 
 * MANIFEST APPROACHES:
 * 
 * 1. Build-time Static (current approach):
 *    - Downloaded via npm script: `uniform context manifest download`
 *    - Pre-hooks: npm run dev/build automatically fetch latest
 *    - Bundled as static JSON in client build
 *    - Pros: Zero runtime API calls, faster startup, works offline
 *    - Cons: Requires rebuild to get manifest updates
 * 
 * 2. Runtime Fetch (alternative with ManifestClient):
 *    import { ManifestClient } from '@uniformdev/context';
 *    const client = new ManifestClient({ apiKey, projectId });
 *    const manifest = await client.get(); // Promise-based fetch
 *    - Pros: Always fresh manifest, no rebuild needed
 *    - Cons: API call on startup, server-only, adds latency
 * 
 * COOKIE STORE: request=undefined → reads from document.cookie.
 * WHY COOKIES: Enables SSR to read visitor state from request.
 */
export function createUniformContext(): Context {
  const plugins: ContextPlugin[] = [
    enableContextDevTools(), // Remove in production
  ];

  const context = new Context({
    defaultConsent: true, // Use real consent manager in production
    manifest: manifest as ManifestV2,
    plugins,
    transitionStore: new RouterCookieTransitionDataStore({
      request: undefined, // Client uses document.cookie
    })
  });

  return context;
}

// Singleton: Created once, reused across navigations.
// Client-side hydration from the server's computed scores is handled automatically:
// VisitorDataStore constructor calls transitionStore.getClientTransitionState() which
// reads the __UNIFORM_DATA__ script (written by UniformContext's TransferState on the
// server) and passes ServerToClientTransitionState to onServerTransitionReceived,
// which sets Context.#scores = state.ssv as a shim until context.update() fires in
// the first UniformContext useEffect.
export const clientContext = createUniformContext();

