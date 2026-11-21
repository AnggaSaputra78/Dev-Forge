import mongoose from 'mongoose';

const codingChallengeSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, 'Judul tantangan wajib diisi'], trim: true, maxlength: 150 },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, required: true },
    difficulty: { type: String, enum: ['Pemula', 'Menengah', 'Lanjutan'], required: true },
    category: {
      type: String,
      enum: ['Array', 'String', 'Objek', 'Fungsi', 'Algoritma', 'Struktur Data'],
      required: true,
    },
    order: { type: Number, required: true },
    constraints: { type: String, default: '' },
    example: {
      input: { type: String, default: '' },
      output: { type: String, default: '' },
    },
    hint: { type: String, default: '' },
    starterCode: {
      language: { type: String, default: 'javascript' },
      code: { type: String, required: true },
    },
    solutionCode: {
      language: { type: String, default: 'javascript' },
      code: { type: String, default: '' },
    },
    testCases: [
      {
        input: { type: mongoose.Schema.Types.Mixed, required: true },
        expected: { type: mongoose.Schema.Types.Mixed, required: true },
        description: { type: String, default: '' },
        isHidden: { type: Boolean, default: false },
      },
    ],
    points: { type: Number, default: 10, min: 1 },
    tags: [String],
    isActive: { type: Boolean, default: true },
    stats: {
      totalAttempts: { type: Number, default: 0 },
      totalSolved: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

codingChallengeSchema.index({ difficulty: 1, category: 1 });
codingChallengeSchema.index({ slug: 1 });

export default mongoose.model('CodingChallenge', codingChallengeSchema);