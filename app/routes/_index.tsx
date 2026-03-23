import { UniformComposition } from "@uniformdev/canvas-react";
import type { RootComponentInstance } from "@uniformdev/canvas";
import { fetchComposition, fetchCompositionById } from "~/lib/uniformClient.server";
import { CANVAS_DRAFT_STATE, CANVAS_PUBLISHED_STATE } from "@uniformdev/canvas";
import { logger } from "~/lib/logger.server";
import type { Route } from "./+types/_index";
import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => [
  { title: "Luxury Travel | Discover Premium Destinations" },
  { name: "description", content: "Explore curated luxury travel experiences, premium destinations, and exclusive packages tailored for the discerning traveller." },
];

/**
 * UNIFORM: Homepage Composition Loader
 * 
 * Two fetch modes:
 * 1. Normal: Fetches by path using project map routing
 * 2. Preview: Direct fetch by ID when editing in Uniform Canvas
 */
export async function loader({ request }: Route.LoaderArgs) {
  logger.debug('HOMEPAGE LOADER: Starting...');
  
  const url = new URL(request.url);
  const path = "/";
  
  const compositionId = url.searchParams.get("compositionId");
  const isPreview = url.searchParams.get("preview") === "true";
  
  let composition: RootComponentInstance | null = null;

  try {
    if (compositionId) {
      logger.debug('HOMEPAGE LOADER: Fetching by ID (preview mode)', { compositionId });
      // UNIFORM: Preview mode bypasses project map, fetches draft/published by ID
      const state = isPreview ? CANVAS_DRAFT_STATE : CANVAS_PUBLISHED_STATE;
      composition = await fetchCompositionById(compositionId, { state });
    } else {
      logger.debug('HOMEPAGE LOADER: Fetching by path', { path });
      // UNIFORM: Project map resolves path → composition
      composition = await fetchComposition(path);
    }

    if (!composition) {
      throw new Response("Not Found", { status: 404 });
    }

    return { composition, isPreview };
  } catch (error) {
    logger.error("HOMEPAGE LOADER: Error loading composition", error);
    throw new Response("Not Found", { status: 404 });
  }
}

export default function HomePage({ loaderData }: Route.ComponentProps) {
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
        <p className="text-xl text-gray-600 mb-8">Homepage not found</p>
        <a
          href="/"
          className="inline-block px-8 py-4 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
        >
          Reload
        </a>
      </div>
    </div>
  );
}
