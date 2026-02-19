import mongoose from "mongoose";

const importLogSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  totalFetched: { type: Number, default: 0 },
  totalImported: { type: Number, default: 0 },
  newJobs: { type: Number, default: 0 },
  updatedJobs: { type: Number, default: 0 },
  failedJobs: { type: Number, default: 0 },
  failedRecords: [
    {
      jobId: { type: String },
      reason: { type: String },
    }
  ],
  timestamp: { type: Date, default: Date.now },
});

// Optional: index for faster queries by source and timestamp
importLogSchema.index({ source: 1, timestamp: -1 });

export const ImportLog = mongoose.model("ImportLog", importLogSchema);
