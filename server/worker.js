import dotenv from "dotenv";
dotenv.config();
import { Worker } from "bullmq";
import redis from "./src/config/redis.config.js";
import { Job } from "./src/models/jobShcema.js";
import { ImportLog } from "./src/models/importLogSchema.js";
// import { connectDB } from "./src/DB/ConnectDB.js";
console.log("MONGO_URI:", process.env.MONGO_URI,"worker db");
console.log("REDIS_HOST:", process.env.REDIS_HOST,"worker  redis");



// connectDB();
let stats = {
  totalFetched: 0,
  newJobs: 0,
  updatedJobs: 0,
  failedJobs: 0,
  failedRecords: [],
};

const saveStats = async (data) => {
  if (stats.totalFetched === 0) return;

  try {
    await ImportLog.create({
      fileName: data.feedUrl || "unknown",
      totalFetched: stats.totalFetched,
      totalImported: stats.newJobs + stats.updatedJobs,
      newJobs: stats.newJobs,
      updatedJobs: stats.updatedJobs,
      failedJobs: stats.failedJobs,
      failedRecords: stats.failedRecords,
    });

    console.log(
      `✅ Import Done | Fetched: ${stats.totalFetched}, New: ${stats.newJobs}, Updated: ${stats.updatedJobs}, Failed: ${stats.failedJobs}`
    );
  } catch (err) {
    console.error(" Error saving stats:", err.message);
  }

  stats = {
    totalFetched: 0,
    newJobs: 0,
    updatedJobs: 0,
    failedJobs: 0,
    failedRecords: [],
  };
};

let datas;

const worker = new Worker(
  "jobQueue",
  async (job) => {
    const data = job.data;
    stats.totalFetched++;
    datas=data

    console.log("Processing job:", data.jobId);

    try {
      const result = await Job.updateOne(
        { jobId: data.jobId, fileName:data.feedUrl ||"Unknown" },
        {
          $set: {
            title: data.title,
            company: data.company,
            location: data.location,
            jobType: data.jobType,
            link: data.link,
            mediaUrl: data.mediaUrl,
            lastSeenAt: new Date(),
          },
        },
        { upsert: true }
      );

      if (result.upsertedCount === 1) {
        stats.newJobs++;
      } else if (result.matchedCount === 1) {
        stats.updatedJobs++;
      }
    } catch (err) {
      stats.failedJobs++;
      stats.failedRecords.push({
        jobId: data.jobId,
        reason: err.message,
      });
      throw err; 
    }
  },
  {
    connection: redis,
    concurrency: 5,
  }
);

// Event: when queue is empty
worker.on("drained", async () => {
  console.log(" Queue drained, saving stats...");
  await saveStats(datas);
});

console.log(" Worker running...");
