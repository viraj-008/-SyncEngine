import axios from "axios";
import { XMLParser } from "fast-xml-parser";

const parser = new XMLParser({
  ignoreAttributes: false,
});

export const fetchJobFeed = async (feedUrl) => {
    try{
        const response = await axios.get(feedUrl);
        const xmlData = response.data;
        const jsonData = parser.parse(xmlData);
        return jsonData;
    }catch(error){
          console.error("API fetch error:", feedUrl,error.message);
          return null;
    }
}

export const normalizeJobs = (jobs) => {
  return jobs.map((job) => ({
    jobId: job.guid?.['#text'] || job.id || job.link,
    title: job.title || "",
    company: job['job_listing:company'] || "",
    location: job['job_listing:location'] || "",
    jobType: job['job_listing:job_type'] || "",
    link: job.link || "",
    mediaUrl: job['media:content']?.['@_url'] || ""
  }));
};