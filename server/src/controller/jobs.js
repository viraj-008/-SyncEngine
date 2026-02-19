import { Job } from "../models/jobShcema.js";

export const getJobs = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 9;
    const skip = (page - 1) * limit;

    const [jobs, total] = await Promise.all([
      Job.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Job.countDocuments(),
    ]);

    res.status(200).json({
      page,
      limit,
      totalRecords: total,
      totalPages: Math.ceil(total / limit),
      jobs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Job data not found",
      error: error.message,
    });
  }
};
