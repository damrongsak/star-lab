import redis from "redis";
import dotenv from "dotenv";
dotenv.config();

import logger from "./logger";

const redisUrl = process.env.REDIS_URL || "redis://redis:6379"; // Fallback to localhost if REDIS_URL not set

let redisClient: redis.RedisClientType | null = null;

const connectRedis = async () => {
  try {
    redisClient = redis.createClient({
      url: redisUrl,
    });

    redisClient.on("error", (err) => logger.error("Redis Client Error", err));

    await redisClient.connect();
    logger.info("Redis client connected");
  } catch (error) {
    logger.error("Could not connect to Redis", error);
    // Consider retrying connection or handling failure appropriately
  }
};

export { connectRedis, redisClient };
