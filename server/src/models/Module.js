import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Judul modul wajib diisi'], trim: true, maxlength: 150 },
    description: { type: String, maxlength: 1000, default: '' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    order: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    stats: {
      totalLessons: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

moduleSchema.index({ course: 1, order: 1 });

export default mongoose.model('Module', moduleSchema);