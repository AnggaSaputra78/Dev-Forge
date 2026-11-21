import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import asyncHandler from '../utils/asyncHandler.js';

// Wajib login
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.cookies?.token) token = req.cookies.token;
  else if (req.headers.authorization?.startsWith('Bearer'))
    token = req.headers.authorization.split(' ')[1];

  if (!token) {
    res.status(401);
    throw new Error('Akses ditolak. Silakan login terlebih dahulu');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password');

  if (!user) {
    res.status(401);
    throw new Error('Pengguna tidak ditemukan');
  }

  if (!user.isActive) {
    res.status(403);
    throw new Error('Akun Anda telah dinonaktifkan');
  }

  req.user = user;
  next();
});

// Cek peran (student/admin)
export const authorize = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    res.status(403);
    return next(new Error(`Peran '${req.user.role}' tidak diizinkan mengakses halaman ini`));
  }
  next();
};