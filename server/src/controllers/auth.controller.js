import User from '../models/User.js';
import Activity from '../models/Activity.js';
import { generateToken } from '../utils/token.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Registrasi pengguna baru
// @route   POST /api/auth/register
// @access  Publik
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Nama, email, dan password wajib diisi');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(409);
    throw new Error('Email sudah terdaftar');
  }

  const user = await User.create({ name, email, password, role: 'student' });
  const token = generateToken(user._id);

  await Activity.create({
    user: user._id,
    type: 'login',
    title: 'Akun baru dibuat',
    description: `${name} bergabung dengan DevForge Academy`,
  });

  res.status(201).json({
    success: true,
    message: 'Registrasi berhasil. Selamat datang di DevForge Academy!',
    data: {
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
      token,
    },
  });
});

// @desc    Login pengguna
// @route   POST /api/auth/login
// @access  Publik
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email dan password wajib diisi');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    res.status(401);
    throw new Error('Email atau password salah');
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error('Akun Anda telah dinonaktifkan');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Email atau password salah');
  }

  user.lastLoginAt = new Date();
  await user.save();

  await Activity.create({
    user: user._id,
    type: 'login',
    title: 'Login berhasil',
  });

  const token = generateToken(user._id);

  res.json({
    success: true,
    message: 'Login berhasil',
    data: {
      user: { id: user._id, name: user.name, email: user.email, role: user.role, avatar: user.avatar },
      token,
    },
  });
});

// @desc    Logout pengguna
// @route   POST /api/auth/logout
// @access  Privat
export const logout = asyncHandler(async (req, res) => {
  res.clearCookie('token');
  res.json({ success: true, message: 'Logout berhasil' });
});

// @desc    Ambil data pengguna yang sedang login
// @route   GET /api/auth/me
// @access  Privat
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({ success: true, data: user });
});