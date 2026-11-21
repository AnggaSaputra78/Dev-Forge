import Activity from '../models/Activity.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Ambil riwayat aktivitas pengguna
// @route   GET /api/activities
// @access  Privat
export const getActivities = asyncHandler(async (req, res) => {
  const { limit = 20, offset = 0 } = req.query;

  const activities = await Activity.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .skip(parseInt(offset))
    .limit(parseInt(limit));

  const total = await Activity.countDocuments({ user: req.user._id });

  res.json({ success: true, count: activities.length, total, data: activities });
});

// @desc    Ambil ringkasan aktivitas 7 hari terakhir
// @route   GET /api/activities/summary
// @access  Privat
export const getActivitySummary = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  const recent = await Activity.find({
    user: userId,
    createdAt: { $gte: last7Days },
  }).sort({ createdAt: -1 });

  const byType = await Activity.aggregate([
    { $match: { user: userId } },
    { $group: { _id: '$type', count: { $sum: 1 } } },
  ]);

  res.json({
    success: true,
    data: {
      recent,
      byType: byType.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {}),
    },
  });
});