import dotenv from "dotenv";
dotenv.config();

import IORedis from 'ioredis';

const redis = new IORedis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT), // convert string to number
  password: process.env.REDIS_PASSWORD,
  family: 4,        // force IPv4 (ENETUNREACH fix)
  tls: undefined,   // IMPORTANT: remove TLS for non-TLS port
  maxRetriesPerRequest: null,
  enableReadyCheck: true,
});

redis.on("connect", () => {
  console.log("✅ Redis connected");
});

redis.on("error", (err) => {
  console.error("❌ Redis error:", err.message);
});

  export default redis;