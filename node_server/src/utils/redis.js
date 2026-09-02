const Redis = require("ioredis");
require("dotenv").config();

// In-memory fallback map in case Redis server is temporarily unreachable
const memoryStore = new Map();

let redisClient = null;
let isRedisConnected = false;

try {
  const rawUrl = process.env.REDIS_URL;
  const redisUrl = rawUrl ? rawUrl.trim() : null;

  const redisOptions = {
    connectTimeout: 10000,
    enableReadyCheck: true,
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      // Reconnect with exponential backoff capped at 3 seconds
      return Math.min(times * 200, 3000);
    }
  };

  if (redisUrl) {
    redisClient = new Redis(redisUrl, redisOptions);
  } else {
    redisClient = new Redis({
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: process.env.REDIS_PORT ? Number(process.env.REDIS_PORT) : 6379,
      password: process.env.REDIS_PASSWORD || undefined,
      ...redisOptions
    });
  }

  redisClient.on("connect", () => {
    console.log("🔄 Redis connection initiated...");
  });

  redisClient.on("ready", () => {
    isRedisConnected = true;
    console.log("✅ Connected to Redis successfully and ready");
  });

  redisClient.on("reconnecting", () => {
    console.log("🔄 Reconnecting to Redis...");
  });

  redisClient.on("error", (err) => {
    isRedisConnected = false;
    console.warn("⚠️  Redis client warning/error:", err.message);
  });

  redisClient.on("close", () => {
    isRedisConnected = false;
  });
} catch (err) {
  console.warn("⚠️  Failed to initialize Redis client. Using in-memory fallback:", err.message);
}

/**
 * Store test data in Redis (with in-memory fallback)
 * @param {string} testId
 * @param {object} data
 * @param {number} ttlSeconds Default: 2 hours (7200s)
 */
async function setTest(testId, data, ttlSeconds = 7200) {
  const key = `test:${testId}`;
  const serialized = JSON.stringify(data);

  if (redisClient && redisClient.status === "ready") {
    try {
      await redisClient.set(key, serialized, "EX", ttlSeconds);
      return true;
    } catch (err) {
      console.warn("Redis SET failed, falling back to memory store:", err.message);
    }
  }

  // Memory fallback with TTL
  memoryStore.set(key, {
    data,
    expiresAt: Date.now() + ttlSeconds * 1000
  });

  return true;
}

/**
 * Retrieve test data from Redis (with in-memory fallback)
 * @param {string} testId
 * @returns {Promise<object|null>}
 */
async function getTest(testId) {
  const key = `test:${testId}`;

  if (redisClient && redisClient.status === "ready") {
    try {
      const val = await redisClient.get(key);
      if (val) {
        return JSON.parse(val);
      }
    } catch (err) {
      console.warn("Redis GET failed, checking memory fallback:", err.message);
    }
  }

  // Memory fallback check
  const item = memoryStore.get(key);
  if (item) {
    if (Date.now() > item.expiresAt) {
      memoryStore.delete(key);
      return null;
    }
    return item.data;
  }

  return null;
}

/**
 * Delete test data from Redis (and in-memory fallback)
 * @param {string} testId
 * @returns {Promise<boolean>}
 */
async function deleteTest(testId) {
  const key = `test:${testId}`;

  if (redisClient && redisClient.status === "ready") {
    try {
      await redisClient.del(key);
    } catch (err) {
      console.warn("Redis DEL failed:", err.message);
    }
  }

  memoryStore.delete(key);
  return true;
}

module.exports = {
  redisClient,
  setTest,
  getTest,
  deleteTest,
  isRedisConnected: () => isRedisConnected && redisClient?.status === "ready"
};
