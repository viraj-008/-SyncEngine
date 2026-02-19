import {ImportLog} from '../models/importLogSchema.js'
export const getImportLogs = async (req, res) => {
   try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 2;
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      ImportLog.find()
        .sort({ timestamp: -1 })     // latest first
        .skip(skip)
        .limit(limit),
      ImportLog.countDocuments(),
    ]);

    res.status(200).json({
      page,
      limit,
      totalRecords: total,
      totalPages: Math.ceil(total / limit),
      data: logs,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
