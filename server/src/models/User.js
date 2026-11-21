import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Nama wajib diisi'],
      trim: true,
      minlength: [2, 'Nama minimal 2 karakter'],
      maxlength: [60, 'Nama maksimal 60 karakter'],
    },
    email: {
      type: String,
      required: [true, 'Email wajib diisi'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Format email tidak valid'],
    },
    password: {
      type: String,
      required: [true, 'Password wajib diisi'],
      minlength: [6, 'Password minimal 6 karakter'],
      select: false,
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
    avatar: { type: String, default: '' },
    bio: { type: String, maxlength: 500, default: '' },
    isActive: { type: Boolean, default: true },
    preferences: {
      theme: { type: String, enum: ['dark', 'light'], default: 'dark' },
      language: { type: String, enum: ['id', 'en'], default: 'id' },
      focusedNavigation: { type: Boolean, default: true },
      notifications: { type: Boolean, default: true },
    },
    stats: {
      completedLessons: { type: Number, default: 0 },
      completedChallenges: { type: Number, default: 0 },
      completedAssessments: { type: Number, default: 0 },
      completedProjects: { type: Number, default: 0 },
      totalPoints: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      lastActiveAt: { type: Date, default: Date.now },
    },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

// Hash password sebelum simpan
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Bandingkan password saat login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.index({ email: 1 });

// Sembunyikan password di response JSON
userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('User', userSchema);