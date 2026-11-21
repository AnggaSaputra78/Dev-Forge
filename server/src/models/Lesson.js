import mongoose from 'mongoose';

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Judul pelajaran wajib diisi'], trim: true, maxlength: 150 },
    slug: { type: String, required: true },
    module: { type: mongoose.Schema.Types.ObjectId, ref: 'Module', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    order: { type: Number, required: true },
    content: { type: String, required: true },
    objectives: [String],
    codeExample: {
      language: { type: String, default: 'javascript' },
      code: { type: String, default: '' },
    },
    duration: { type: Number, default: 15 },
    isPreview: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

lessonSchema.index({ module: 1, order: 1 });
lessonSchema.index({ course: 1 });

export default mongoose.model('Lesson', lessonSchema);