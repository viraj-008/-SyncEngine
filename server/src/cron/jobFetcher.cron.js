import cron from "node-cron";
import { fetchJobFeed, normalizeJobs } from "../services/jobFeed.service.js";

import { jobQueue } from "../queue/job.queue.js";

const jobFeedUrl = [
  "https://jobicy.com/?feed=job_feed",
  "https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time",
  "https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france",
  "https://jobicy.com/?feed=job_feed&job_categories=design-multimedia",
  "https://jobicy.com/?feed=job_feed&job_categories=data-science",
  "https://jobicy.com/?feed=job_feed&job_categories=copywriting",
  "https://jobicy.com/?feed=job_feed&job_categories=business",
  "https://jobicy.com/?feed=job_feed&job_categories=management",
  "https://www.higheredjobs.com/rss/articleFeed.cfm",
];

export const cronJob = cron.schedule("0 * * * *" , async () => {
  for (const url of jobFeedUrl) {
    const data = await fetchJobFeed(url);
    try {
      let items = data?.rss?.channel?.item || [];
      if (!Array.isArray(items)) {
        items = [items];
      }
      const source = url.includes("higheredjobs") ? "higheredjobs" : "jobicy";
      const normalizedJobs = normalizeJobs(items);

      if (normalizedJobs.length > 0) {
        console.log("Saving jobs to queue...", normalizedJobs.length);
      } else {
        console.log("No jobs found for:", url);
      }
      for (const job of normalizedJobs) {
        await jobQueue.add(
          "import-job",
          {
            ...job,
            feedUrl: url, 
          },
          {
            attempts: 3,
            backoff: { type: "exponential", delay: 5000 },
          },
        );
      }
      console.log(`✅ Added ${normalizedJobs.length} jobs from ${source}`);
    } catch (error) {
      console.error("Cron job error:", url, error.message);
    }
  }
  console.log("Cron job finished");
  
});

