import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Ambil profil pengguna
// @route   GET /api/users/me
// @access  Privat
export const getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('Pengguna tidak ditemukan');
  }
  res.json({ success: true, data: user });
});

// @desc    Perbarui profil pengguna
// @route   PUT /api/users/me
// @access  Privat
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, bio, preferences } = req.body;

  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error('Pengguna tidak ditemukan');
  }

  if (name !== undefined) user.name = name;
  if (bio !== undefined) user.bio = bio;
  if (preferences !== undefined) {
    user.preferences = { ...user.preferences.toObject(), ...preferences };
  }

  await user.save();

  res.json({
    success: true,
    message: 'Profil berhasil diperbarui',
    data: user,
  });
});

// @desc    Ganti password
// @route   PUT /api/users/me/password
// @access  Privat
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');
  if (!user) {
    res.status(404);
    throw new Error('Pengguna tidak ditemukan');
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    res.status(400);
    throw new Error('Password saat ini tidak sesuai');
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Password berhasil diubah' });
});

// @desc    Ambil statistik pengguna
// @route   GET /api/users/me/stats
// @access  Privat
export const getStats = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({
    success: true,
    data: { stats: user.stats, preferences: user.preferences },
  });
});