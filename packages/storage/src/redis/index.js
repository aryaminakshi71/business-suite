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
        async get(key) {
            return redis.get(key);
        },
        async set(key, value, ttlSeconds) {
            if (ttlSeconds) {
                await redis.set(key, value, { ex: ttlSeconds });
            }
            else {
                await redis.set(key, value);
            }
        },
        async delete(key) {
            await redis.del(key);
        },
        async deleteMany(keys) {
            if (keys.length > 0) {
                await redis.del(...keys);
            }
        },
    };
}
function createNoOpClient() {
    return {
        client: null,
        async get(_key) {
            return null;
        },
        async set(_key, _value, _ttlSeconds) {
            // No-op
        },
        async delete(_key) {
            // No-op
        },
        async deleteMany(_keys) {
            // No-op
        },
    };
}
export const redis = createRedisClient();
export async function getOrCache(key, fetcher, ttlSeconds = 3600) {
    const cached = await redis.get(key);
    if (cached !== null) {
        return cached;
    }
    const value = await fetcher();
    await redis.set(key, value, ttlSeconds);
    return value;
}
export async function invalidateCache(key) {
    await redis.delete(key);
}
