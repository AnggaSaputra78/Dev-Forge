import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Judul proyek wajib diisi'], trim: true, maxlength: 150 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    level: { type: String, enum: ['Pemula', 'Menengah', 'Lanjutan'], required: true },
    order: { type: Number, required: true },
    requirements: { type: String, default: '' },
    technicalSpecs: { type: String, default: '' },
    architecture: { type: String, default: '' },
    milestones: [
      {
        title: { type: String, required: true },
        description: { type: String, default: '' },
        order: { type: Number, required: true },
      },
    ],
    estimatedHours: { type: Number, default: 10 },
    tags: [String],
    isActive: { type: Boolean, default: true },
    stats: {
      totalStarted: { type: Number, default: 0 },
      totalCompleted: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

projectSchema.index({ level: 1, order: 1 });

export default mongoose.model('Project', projectSchema);