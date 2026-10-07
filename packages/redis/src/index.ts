import Redis from "ioredis";

export const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  enableOfflineQueue: false,
  maxRetriesPerRequest: 1,
  connectTimeout: 2000,
  lazyConnect: false,
  retryStrategy(times) {
    return Math.min(times * 200, 5000);
  },
});

redis.connect().catch(() => {
  // Gracefully handle offline Redis in local development
});

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (_error) => {
  // Swallow connection errors to prevent unhandled rejections
});