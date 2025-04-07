// backend/customer-service/src/test-redis.ts
import redis from "redis";

async function testRedisConnection() {
  try {
    const client = redis.createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });

    client.on("error", (err) =>
      console.error("Redis Client Error in test:", err),
    );

    await client.connect();
    console.log("Redis connection test successful!");
    await client.quit();
  } catch (error) {
    console.error("Redis connection test failed:", error);
  }
}

testRedisConnection();
