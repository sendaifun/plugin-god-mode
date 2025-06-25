import { SolanaAgentKit } from "solana-agent-kit";
import { LRUCache } from "lru-cache";
import redis, { RedisClientType } from "redis";

// Global cache instance
export const cache = new LRUCache<string, any>({
    max: 1000,
    ttl: 1000 * 60 * 60 * 24,
});

// Global Redis client instance
let globalRedisClient: RedisClientType | null = null;

export const getCache = async (agent: SolanaAgentKit): Promise<RedisClientType | LRUCache<string, any>> => {
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

export const getCacheValue = async (agent: SolanaAgentKit, key: string): Promise<any> => {
    const cache = await getCache(agent);
    return cache.get(key);
}

export const setCacheValue = async (agent: SolanaAgentKit, key: string, value: any): Promise<void> => {
    const cache = await getCache(agent);
    cache.set(key, value);
}

export default {
    getCacheValue,
    setCacheValue,
}
