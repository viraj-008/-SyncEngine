import dotenv from 'dotenv';
dotenv.config();
import cors from 'cors';
import { Queue } from "bullmq";
import redis from './src/config/redis.config.js';
import  {getImportLogs}  from './src/controller/importLogController.js';
import { getJobs } from './src/controller/jobs.js';
import { lastImportStatus } from './src/controller/system-status.js';
import { cronJob } from './src/cron/jobFetcher.cron.js';
import './worker.js'
import { connectDB } from './src/DB/ConnectDB.js';
import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

connectDB();
app.use(cors({
    origin: 'http://localhost:3001' 
}));

const queue = new Queue("jobQueue", {
  connection: redis
});
cronJob.start();

app.get('/api/import-logs', getImportLogs);
app.get('/api/get-jobs', getJobs);
app.get('/api', lastImportStatus);




app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
