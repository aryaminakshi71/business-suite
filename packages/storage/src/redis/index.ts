/**
 * Shared Redis Client for Suite
 */

import { env } from "@suite/env/server";
import { Redis } from "@upstash/redis";

export function createRedisClient() {
  const url = env.UPSTASH_REDIS_REST_URL;
  const token = env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    return createNoOpClient();
  }

  const redis = new Redis({ url, token });

  return {
    client: redis,
    async get<T>(key: string): Promise<T | null> {
      return redis.get<T>(key);
    },
    async set<T>(key: string, value: T, ttlSeconds?: number): Promise<void> {
      if (ttlSeconds) {
        await redis.set(key, value, { ex: ttlSeconds });
      } else {
        await redis.set(key, value);
      }
    },
    async delete(key: string): Promise<void> {
      await redis.del(key);
    },
    async deleteMany(keys: string[]): Promise<void> {
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    },
  };
}

function createNoOpClient() {
  return {
    client: null,
    async get<T>(_key: string): Promise<T | null> {
      return null;
    },
    async set<T>(_key: string, _value: T, _ttlSeconds?: number): Promise<void> {
      // No-op
    },
    async delete(_key: string): Promise<void> {
      // No-op
    },
    async deleteMany(_keys: string[]): Promise<void> {
      // No-op
    },
  };
}

export const redis = createRedisClient();

export async function getOrCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 3600
): Promise<T> {
  const cached = await redis.get<T>(key);
  if (cached !== null) {
    return cached;
  }
  const value = await fetcher();
  await redis.set(key, value, ttlSeconds);
  return value;
}

export async function invalidateCache(key: string): Promise<void> {
  await redis.delete(key);
}
