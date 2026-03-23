import { UniformComposition } from "@uniformdev/canvas-react";
import type { RootComponentInstance } from "@uniformdev/canvas";
import { fetchComposition, fetchCompositionById } from "~/lib/uniformClient.server";
import { CANVAS_DRAFT_STATE, CANVAS_PUBLISHED_STATE } from "@uniformdev/canvas";
import { logger } from "~/lib/logger.server";
import type { Route } from "./+types/$";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
  { title: "Luxury Travel" },
  { name: "description", content: "Explore curated luxury travel experiences and premium destinations." },
];

/**
 * Server-side loader for dynamic routes
 * 
 * Fetches Uniform composition based on URL path
 */
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const path = url.pathname === "" ? "/" : url.pathname;
  
  // Static asset patterns to ignore (don't log errors for these)
  const staticAssetPatterns = [
    /\.(ico|png|jpg|jpeg|gif|svg|webp)$/i,  // Images
    /\.(woff|woff2|ttf|eot|otf)$/i,          // Fonts
    /\.(js|css|map)$/i,                      // Assets
    /\.(xml|txt)$/i,                         // Common files (robots.txt, sitemap.xml)
    /^\/favicon\./i,                         // Any favicon variant
    /^\/.well-known\//i,                     // Security files
    /^\/assets\//i,                          // Asset directory
    /^\/build\//i,                           // Build directory
  ];
  
  // Check if this is a static asset request
  const isStaticAsset = staticAssetPatterns.some(pattern => pattern.test(path));
  
  if (isStaticAsset) {
    // Silently return 404 for static assets (don't log errors)
    throw new Response("Not Found", { status: 404 });
  }
  
  // Check if we're in preview mode
  const compositionId = url.searchParams.get("compositionId");
  const isPreview = url.searchParams.get("preview") === "true";
  
  let composition: RootComponentInstance | null = null;

  try {
    if (compositionId) {
      // Direct fetch by ID (for preview mode)
      const state = isPreview ? CANVAS_DRAFT_STATE : CANVAS_PUBLISHED_STATE;
      composition = await fetchCompositionById(compositionId, { state });
    } else {
      // Normal route-based fetching
      composition = await fetchComposition(path);
    }

    if (!composition) {
      // Log actual page 404s (not static assets)
      logger.warn("DYNAMIC PAGE: Composition not found", { path });
      throw new Response("Not Found", { status: 404 });
    }

    return { composition, isPreview };
  } catch (error) {
    // Only log if it's not a Response error (those are expected 404s)
    if (!(error instanceof Response)) {
      logger.error("DYNAMIC PAGE: Error loading composition", error, { path });
    }
    throw error instanceof Response ? error : new Response("Server Error", { status: 500 });
  }
}

export default function DynamicPage({ loaderData }: Route.ComponentProps) {
  return (
    <UniformComposition 
      data={loaderData.composition} 
      behaviorTracking="onLoad"
    />
  );
}

/**
 * Error Boundary - handles 404s and other errors
 */
export function ErrorBoundary() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-linear-to-br from-gray-50 to-gray-100 px-6">
      <div className="text-center max-w-md">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-red-100 rounded-full mb-6">
          <span className="text-4xl">😕</span>
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-8">Page not found</p>
        <a
          href="/"
          className="inline-block px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Go Home
        </a>
      </div>
    </div>
  );
}
