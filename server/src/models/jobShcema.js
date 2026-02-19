import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    jobId: { type: String, required: true },
    fileName: { type: String, required: true },
    title: { type: String, required: true },
    company: String,
    location: String,
    jobType: String,
    link: String,
    mediaUrl: String,
    lastSeenAt: { type: Date, default: new Date() },

  },
  { timestamps: true }
);

jobSchema.index({ jobId: 1, source: 1 }, { unique: true });

export const Job = mongoose.model("Job", jobSchema);
