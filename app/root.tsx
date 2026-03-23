import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "react-router";
import type { LinksFunction, LoaderFunctionArgs, HeadersFunction } from "react-router";
import { useMemo } from "react";
import { parse } from "cookie";
import { UniformContext } from "@uniformdev/context-react";
import { clientContext } from "~/lib/uniformContext";
import { Context, ManifestV2, enableContextDevTools } from "@uniformdev/context";
import { RouterCookieTransitionDataStore } from "~/lib/RouterCookieTransitionDataStore";
import { getGeoData, geoToQuirks } from "~/lib/geo.server";
import { getSecurityHeaders, getContentSecurityPolicy } from "~/lib/security.server";
import manifest from "~/lib/contextManifest.json";
import "@/styles/globals.css";

// Import component registry to register all Uniform components
import "@/components/componentRegistry";

export const links: LinksFunction = () => [
  { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
];

/**
 * Security Headers Applied to All Routes
 * 
 * Implements OWASP recommendations:
 * - CSP (Content Security Policy)
 * - X-Frame-Options, X-Content-Type-Options, etc.
 * - HSTS (in production)
 */
export const headers: HeadersFunction = () => {
  const securityHeaders = getSecurityHeaders();
  
  // CSP is RECOMMENDED to enable proper frame-ancestors control
  // The CSP configuration is already Uniform-compatible
  // Set ENABLE_CSP=true in your .env to enable
  const cspEnabled = process.env.ENABLE_CSP === 'true';
  
  return {
    ...securityHeaders,
    ...(cspEnabled && {
      'Content-Security-Policy': getContentSecurityPolicy(),
    }),
  };
};

/**
 * Root Loader - Uniform Context SSR Setup
 *
 * Returns the raw request inputs needed to reconstruct an identical Context
 * in the render tree (cookie for visitor state, URL for page signals, geo
 * for Vercel edge-injected country/region/city).  The render tree's useMemo
 * creates the Context and feeds these three signal types to context.update()
 * in a single call — the same pattern as enableNextSsr in context-next.
 *
 * geoQuirks is returned as a pre-built object (loader is server-only, so the
 * conversion belongs here rather than in the component).
 */
export async function loader({ request }: LoaderFunctionArgs) {
  return {
    cookieHeader: request.headers.get('Cookie'),
    requestUrl:   request.url,
    geoQuirks:    geoToQuirks(getGeoData(request)),
  };
}

/**
 * UNIFORM PATTERN: SSR Context with Cookie, URL, and Geo Personalization
 *
 * WHY FRESH CONTEXT PER SSR:
 *   Context instances are not request-safe to share — each render needs its own.
 *
 * WHY A SINGLE context.update() CALL:
 *   All three signal types are applied at once so the SSR render sees a fully
 *   evaluated state before React renders any <Personalize> component:
 *
 *   url      → queryStringEvaluator  (UTM params, QS enrichments)
 *              currentPageEvaluator  (page-match rules)
 *              pageViewCountEvaluator (session/total PV counts)
 *   cookies  → cookieEvaluator        (cookie-based enrichment signals)
 *   quirks   → quirkEvaluator         (geo: vc-country, vc-region, vc-city)
 *
 *   Score computation fires synchronously inside VisitorDataStore.applyCommands
 *   before the first async await (the no-op SSR cookie write), so by the time
 *   React renders children after useMemo returns, context.scores and
 *   context.quirks already reflect the full evaluated state.
 *   This mirrors enableNextSsr from context-next which also does not await.
 *
 * WHY NO MANUAL __UNIFORM_DATA__ SCRIPT:
 *   UniformContext's built-in TransferState serialises getServerToClientTransitionState()
 *   — shape { ssv, quirks, tests, personalizeVariants } — into a single
 *   <script id="__UNIFORM_DATA__"> tag.  VisitorDataStore reads this during
 *   the client singleton's construction (before React hydration) and passes it
 *   to onServerTransitionReceived, which shims context.scores = state.ssv and
 *   merges geo quirks, preventing a flash of unpersonalised content.
 *   A second manual script with the same id would break getElementById lookup.
 */
export default function Root() {
  const { cookieHeader, requestUrl, geoQuirks } = useLoaderData<typeof loader>();

  const context = useMemo(() => {
    if (typeof window === 'undefined') {
      const ssrContext = new Context({
        defaultConsent: true,
        manifest: manifest as ManifestV2,
        plugins: [enableContextDevTools()],
        transitionStore: new RouterCookieTransitionDataStore({
          request: cookieHeader ? {
            headers: {
              get: (name: string) => name === 'Cookie' ? cookieHeader : null,
            },
          } as any : undefined,
        }),
      });

      // Single update covers all signal types in one synchronous pass.
      ssrContext.update({
        url:     new URL(requestUrl),
        cookies: cookieHeader ? parse(cookieHeader) : {},
        quirks:  geoQuirks,
      });

      return ssrContext;
    }
    return clientContext;
  // geoQuirks is an object but React Router memoises loader data — its
  // reference is stable between renders of the same URL. The SSR path runs
  // once per request; the client path returns clientContext immediately.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookieHeader, requestUrl, geoQuirks]);
  
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <UniformContext context={context} outputType="standard">
          <Outlet />
        </UniformContext>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
