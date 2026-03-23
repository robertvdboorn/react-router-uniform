/**
 * Type definitions for Uniform Context hydration
 * 
 * SECURITY UPDATE: Context state is now injected as JSON in a script tag
 * with type="application/json" to prevent XSS attacks. It's read using
 * document.getElementById() + JSON.parse() instead of window globals.
 */

declare global {
  interface Window {
    /**
     * @deprecated No longer used - kept for backwards compatibility
     * Context state is now read from <script id="__UNIFORM_DATA__" type="application/json">
     */
    __UNIFORM_CONTEXT_STATE__?: {
      scores: Record<string, number>;
      quirks: Record<string, any>;
    };
  }
}

export {};
