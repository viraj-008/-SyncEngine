import {Queue} from 'bullmq';
import redis from '../config/redis.config.js';

export const jobQueue = new Queue("jobQueue", {
  connection: redis,
});

