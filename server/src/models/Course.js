import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Judul kursus wajib diisi'], trim: true, maxlength: 150 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true, maxlength: 2000 },
    learningPath: { type: mongoose.Schema.Types.ObjectId, ref: 'LearningPath', required: true },
    level: { type: String, enum: ['Pemula', 'Menengah', 'Lanjutan'], required: true },
    order: { type: Number, required: true },
    estimatedHours: { type: Number, required: true },
    objectives: [{ type: String, maxlength: 300 }],
    tags: [String],
    isActive: { type: Boolean, default: true },
    stats: {
      totalModules: { type: Number, default: 0 },
      totalLessons: { type: Number, default: 0 },
      totalCompleted: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

courseSchema.index({ learningPath: 1, order: 1 });
courseSchema.index({ slug: 1 });

export default mongoose.model('Course', courseSchema);