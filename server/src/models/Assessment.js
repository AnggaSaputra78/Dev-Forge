import mongoose from 'mongoose';

const assessmentSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Judul asesmen wajib diisi'], trim: true, maxlength: 150 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: '' },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    type: {
      type: String,
      enum: ['quiz', 'checkpoint', 'ujian_akhir'],
      default: 'checkpoint',
    },
    timeLimit: { type: Number, default: 30 },
    passingScore: { type: Number, default: 70, min: 0, max: 100 },
    questions: [
      {
        question: { type: String, required: true },
        type: {
          type: String,
          enum: ['pilihan_ganda', 'benar_salah', 'isian_singkat'],
          required: true,
        },
        options: [String],
        correctAnswer: { type: mongoose.Schema.Types.Mixed, required: true },
        explanation: { type: String, default: '' },
        points: { type: Number, default: 10 },
        order: { type: Number, required: true },
      },
    ],
    maxAttempts: { type: Number, default: 3 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

assessmentSchema.index({ course: 1 });

export default mongoose.model('Assessment', assessmentSchema);