import type { Route } from "./+types/api.health";
import { getRedisClient } from "~/lib/redis.server";
import { uniformRouteClient } from "~/lib/uniformClient.server";
import { logger } from "~/lib/logger.server";
import { ResolvedRouteGetResponse } from "@uniformdev/canvas";

// Track application startup time for uptime calculation
const startupTime = Date.now();

/**
 * Health Check Endpoint
 *
 * Used for monitoring application health in production.
 * Checks connectivity to critical services:
 * - Redis (if configured)
 * - Uniform API
 *
 * Usage:
 * - Load balancers: Check /api/health returns 200
 * - Monitoring: Parse JSON response for service status
 * - CI/CD: Verify deployment health post-deploy
 *
 * Response format:
 * {
 *   status: "healthy" | "degraded" | "unhealthy",
 *   timestamp: "ISO timestamp",
 *   uptime: number (milliseconds),
 *   version: string,
 *   services: {
 *     redis: {
 *       status: "ok" | "unavailable" | "error",
 *       responseTime: number,
 *       message?: string
 *     },
 *     uniform: {
 *       status: "ok" | "error",
 *       responseTime: number,
 *       message?: string
 *     }
 *   }
 * }
 */
export async function loader(_args: Route.LoaderArgs) {
  // Run health checks in parallel for better performance
  const [redis, uniform] = await Promise.all([checkRedis(), checkUniform()]);

  const checks = { redis, uniform };

  // Determine overall health
  const hasErrors = Object.values(checks).some((c) => c.status === "error");
  const hasUnavailable = Object.values(checks).some(
    (c) => c.status === "unavailable"
  );

  let overallStatus: "healthy" | "degraded" | "unhealthy";
  let httpStatus: number;

  if (hasErrors) {
    overallStatus = "unhealthy";
    httpStatus = 503; // Service Unavailable
  } else if (hasUnavailable) {
    overallStatus = "degraded";
    httpStatus = 200; // Still operational (Redis is optional)
  } else {
    overallStatus = "healthy";
    httpStatus = 200;
  }

  const response = {
    status: overallStatus,
    timestamp: new Date().toISOString(),
    uptime: Date.now() - startupTime,
    version: process.env.npm_package_version || "unknown",
    services: checks,
  };

  // Log health check results (info level, not debug)
  logger.info("HEALTH CHECK", response);

  return Response.json(response, {
    status: httpStatus,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-cache, no-store, must-revalidate",
    },
  });
}

/**
 * Wrap a promise with a timeout
 */
async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  timeoutMessage = "Operation timed out"
): Promise<T> {
  const timeoutPromise = new Promise<T>((_, reject) =>
    setTimeout(() => reject(new Error(timeoutMessage)), timeoutMs)
  );

  return Promise.race([promise, timeoutPromise]);
}

/**
 * Check Redis connectivity
 */
async function checkRedis(): Promise<{
  status: "ok" | "unavailable" | "error";
  responseTime: number;
  message?: string;
}> {
  const startTime = Date.now();

  try {
    // Check if Redis is configured
    if (
      !process.env.UPSTASH_REDIS_REST_URL ||
      !process.env.UPSTASH_REDIS_REST_TOKEN
    ) {
      return {
        status: "unavailable",
        responseTime: Date.now() - startTime,
        message: "Redis not configured (optional in development)",
      };
    }

    const redis = getRedisClient();

    // Perform a simple ping test with timeout protection
    // This is more reliable than read/write for health checks
    const pingResult = await withTimeout(
      redis.ping(),
      5000, // 5 second timeout
      "Redis health check timed out"
    );

    if (pingResult !== "PONG") {
      throw new Error(`Redis ping failed - expected PONG, got: ${pingResult}`);
    }

    return {
      status: "ok",
      responseTime: Date.now() - startTime,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    logger.error("HEALTH CHECK: Redis check failed", error);
    return {
      status: "error",
      responseTime,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Check Uniform API connectivity
 */
async function checkUniform(): Promise<{
  status: "ok" | "error";
  responseTime: number;
  message?: string;
}> {
  const startTime = Date.now();

  try {
    // Try to fetch a composition by path (lightweight check)
    // This validates:
    // - API credentials are correct
    // - Network connectivity to Uniform
    // - Project ID is valid
    const routeResponse = await withTimeout(
      uniformRouteClient.getRoute({
        path: "/__health_check__", // Non-existent path is fine, we just want to test API
      }),
      5000, // 5 second timeout
      "Uniform API health check timed out"
    );

    // Any valid response type means the API is working
    const validResponseTypes = ["composition", "notFound", "redirect", "error"];
    const responseType = (routeResponse as ResolvedRouteGetResponse)?.type;

    if (responseType && validResponseTypes.includes(responseType)) {
      return {
        status: "ok",
        responseTime: Date.now() - startTime,
      };
    }

    return {
      status: "error",
      responseTime: Date.now() - startTime,
      message: `Unexpected response type: ${responseType || "unknown"}`,
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    logger.error("HEALTH CHECK: Uniform check failed", error);
    return {
      status: "error",
      responseTime,
      message: error instanceof Error ? error.message : "API connection failed",
    };
  }
}
