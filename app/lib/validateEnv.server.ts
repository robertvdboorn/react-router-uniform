/**
 * Fail-Fast Environment Validation
 * 
 * Throws on server startup if Uniform API keys are missing.
 * Better to crash immediately than fail when users load pages.
 */

import { logger } from "./logger.server";

export function validateEnvironment() {
  // Required environment variables for Uniform API
  const required = [
    'UNIFORM_API_KEY',
    'UNIFORM_PROJECT_ID',
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    throw new Error(
      `❌ Missing required environment variables:\n` +
      missing.map(key => `  - ${key}`).join('\n') +
      `\n\nAdd them to your .env file or deployment environment!\n` +
      `See env.example for reference.`
    );
  }
  
  // Validate preview secret in production
  if (process.env.NODE_ENV === 'production') {
    if (!process.env.UNIFORM_PREVIEW_SECRET) {
      throw new Error(
        '❌ UNIFORM_PREVIEW_SECRET is required in production!\n' +
        'This prevents unauthorized access to preview mode.'
      );
    }
    if (process.env.UNIFORM_PREVIEW_SECRET === 'hello-world') {
      throw new Error(
        '❌ Change UNIFORM_PREVIEW_SECRET from default value!\n' +
        'Using the default "hello-world" is insecure in production.'
      );
    }
    
    // Redis required in production for token storage & rate limiting
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      logger.warn(
        'Redis not configured in production!\n' +
        'Preview tokens will use in-memory storage (not cluster-safe).\n' +
        'Rate limiting will be disabled.\n' +
        'Add UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN to enable.'
      );
    }
  }
  
  // Redis optional in development
  if (process.env.NODE_ENV !== 'production') {
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
      logger.info('Redis not configured - using in-memory fallback (dev only)');
    }
  }
  
  // Success message for server startup confirmation
  logger.info('Environment variables validated successfully');
}

/**
 * Get a required environment variable, throwing an error if missing
 */
export function getRequiredEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(
      `❌ Missing required environment variable: ${key}\n` +
      'This should have been caught during startup validation.'
    );
  }
  return value;
}
