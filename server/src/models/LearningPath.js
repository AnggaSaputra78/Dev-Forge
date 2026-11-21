import mongoose from 'mongoose';

const learningPathSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Judul wajib diisi'], trim: true, maxlength: 150 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true, maxlength: 1000 },
    level: { type: String, enum: ['Pemula', 'Menengah', 'Lanjutan'], required: true },
    order: { type: Number, required: true, unique: true },
    estimatedHours: { type: Number, required: true, min: 1 },
    icon: { type: String, default: 'book-open' },
    isActive: { type: Boolean, default: true },
    stats: {
      totalCourses: { type: Number, default: 0 },
      totalEnrolled: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

learningPathSchema.index({ order: 1 });

export default mongoose.model('LearningPath', learningPathSchema);