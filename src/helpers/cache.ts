import { SolanaAgentKit } from "solana-agent-kit";
import TTLCache from "@isaacs/ttlcache";
import redis, { RedisClientType } from "redis";

// Default TTL configuration (24 hours in seconds)
const DEFAULT_TTL_SECONDS = 24 * 60 * 60;

// Global cache instance - TTLCache with max size limit
export const cache = new TTLCache<string, any>({
    max: 1000,
});

// Global Redis client instance
let globalRedisClient: RedisClientType | null = null;

/**
 * Get the cache instance
 * @param agent - SolanaAgentKit instance
 * @returns The cache instance
 */
export const getCache = async (agent: SolanaAgentKit): Promise<RedisClientType | TTLCache<string, any>> => {
    if (globalRedisClient && globalRedisClient.isReady) {
        return globalRedisClient;
    }

    const REDIS_URL = agent.config.OTHER_API_KEYS?.REDIS_URL

    if (!REDIS_URL) {
        console.warn("REDIS_URL is not set, using local cache");
        return cache;
    }

    // Create new Redis client only if needed
    if (!globalRedisClient) {
        globalRedisClient = redis.createClient({ url: REDIS_URL }) as RedisClientType;
    }

    try {
        if (!globalRedisClient.isReady) {
            await globalRedisClient.connect();
        }
        return globalRedisClient;
    } catch (error) {
        console.error("Error connecting to Redis", error);
        globalRedisClient = null; // Reset on error
        return cache;
    }
}   

/**
 * Get a value from the cache
 * @param agent - SolanaAgentKit instance
 * @param key - The key to get
 * @returns The value from the cache
 */
export const getCacheValue = async (agent: SolanaAgentKit, key: string): Promise<any> => {
    const cacheInstance = await getCache(agent);
    
    if (cacheInstance instanceof TTLCache) {
        return cacheInstance.get(key);
    } else {
        // Redis client
        const value = await cacheInstance.get(key);
        if (!value) return null;
        
        // Try to parse as JSON, if it fails, return as string
        try {
            return JSON.parse(value);
        } catch {
            return value;
        }
    }
}

/**
 * Set a value in the cache
 * @param agent - SolanaAgentKit instance
 * @param key - The key to set
 * @param value - The value to set
 * @param ttlSeconds - The TTL in seconds
 */
export const setCacheValue = async (
    agent: SolanaAgentKit, 
    key: string, 
    value: any, 
    ttlSeconds: number = DEFAULT_TTL_SECONDS
): Promise<void> => {
    const cacheInstance = await getCache(agent);
    
    if (cacheInstance instanceof TTLCache) {
        // TTLCache supports per-key TTL in milliseconds
        cacheInstance.set(key, value, { ttl: ttlSeconds * 1000 });
    } else {
        // Redis client - smart serialization: only stringify non-strings
        const valueToStore = typeof value === 'string' ? value : JSON.stringify(value);
        await cacheInstance.setEx(key, ttlSeconds, valueToStore);
    }
}

export const clearCacheValue = async (agent: SolanaAgentKit, key: string): Promise<void> => {
    const cacheInstance = await getCache(agent);
    if (cacheInstance instanceof TTLCache) {
        cacheInstance.delete(key);
    } else {
        await cacheInstance.del(key);
    }
}

export default {
    getCacheValue,
    setCacheValue,
    clearCacheValue,
    DEFAULT_TTL_SECONDS,
}
