import { createHash, randomBytes } from 'crypto';
import { getRedisClient } from '../../../app/lib/redis.server';

/**
 * Preview Token Manager (Redis-Backed)
 * 
 * Manages secure preview tokens to prevent unauthorized preview access.
 * Tokens are signed with the preview secret and have an expiration time.
 * 
 * STORAGE: Redis with automatic TTL expiration (no manual cleanup needed!)
 * CLUSTER-SAFE: Works across multiple server instances
 * PERSISTENT: Survives server restarts (editors stay logged in)
 */

interface PreviewToken {
  token: string;
  expiresAt: number;
}

const REDIS_KEY_PREFIX = 'preview:token:';

/**
 * Get Redis client (lazy initialization)
 */
function getRedis() {
  try {
    return getRedisClient();
  } catch (error) {
    // Fallback to in-memory for local dev without Redis
    console.warn('⚠️  Redis not configured, using in-memory token storage');
    return null;
  }
}

// Fallback: In-memory storage for local dev without Redis
const memoryTokens = new Map<string, PreviewToken>();

/**
 * Generate a secure preview token
 * Token is valid for 24 hours by default
 */
export async function generatePreviewToken(
  secret: string, 
  expirationMs = 24 * 60 * 60 * 1000
): Promise<string> {
  const randomPart = randomBytes(32).toString('hex');
  const timestamp = Date.now();
  const expiresAt = timestamp + expirationMs;
  
  // Create a signed token: randomPart.expiresAt.signature
  const payload = `${randomPart}.${expiresAt}`;
  const signature = createHash('sha256')
    .update(payload + secret)
    .digest('hex')
    .substring(0, 32);
  
  const token = `${payload}.${signature}`;
  const tokenData: PreviewToken = { token, expiresAt };
  
  // Store in Redis with automatic expiration (TTL)
  const redis = getRedis();
  if (redis) {
    const ttlSeconds = Math.ceil(expirationMs / 1000);
    await redis.setex(`${REDIS_KEY_PREFIX}${token}`, ttlSeconds, JSON.stringify(tokenData));
  } else {
    // Fallback: In-memory storage
    memoryTokens.set(token, tokenData);
  }
  
  return token;
}

/**
 * Validate a preview token
 * Returns true if token is valid and not expired
 */
export async function validatePreviewToken(
  token: string | null | undefined, 
  secret: string
): Promise<boolean> {
  if (!token) return false;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return false;
    
    const [randomPart, expiresAtStr, providedSignature] = parts;
    if (!randomPart || !expiresAtStr || !providedSignature) return false;
    
    const expiresAt = parseInt(expiresAtStr, 10);
    
    // Check if token is expired
    if (expiresAt < Date.now()) {
      const redis = getRedis();
      if (redis) {
        await redis.del(`${REDIS_KEY_PREFIX}${token}`);
      } else {
        memoryTokens.delete(token);
      }
      return false;
    }
    
    // Verify signature (prevents tampering)
    const payload = `${randomPart}.${expiresAt}`;
    const expectedSignature = createHash('sha256')
      .update(payload + secret)
      .digest('hex')
      .substring(0, 32);
    
    if (providedSignature !== expectedSignature) {
      return false;
    }
    
    // Check if token exists in storage
    const redis = getRedis();
    if (redis) {
      const stored = await redis.get(`${REDIS_KEY_PREFIX}${token}`);
      return stored !== null;
    } else {
      return memoryTokens.has(token);
    }
  } catch (error) {
    console.error('Token validation error:', error);
    return false;
  }
}

/**
 * Revoke a preview token
 */
export async function revokePreviewToken(token: string): Promise<void> {
  const redis = getRedis();
  if (redis) {
    await redis.del(`${REDIS_KEY_PREFIX}${token}`);
  } else {
    memoryTokens.delete(token);
  }
}

/**
 * Revoke all preview tokens (useful for security incidents)
 */
export async function revokeAllPreviewTokens(): Promise<void> {
  const redis = getRedis();
  if (redis) {
    // Scan for all tokens with our prefix and delete them
    const keys = await redis.keys(`${REDIS_KEY_PREFIX}*`);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } else {
    memoryTokens.clear();
  }
}

