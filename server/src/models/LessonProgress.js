import mongoose from 'mongoose';

const lessonProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lesson: { type: mongoose.Schema.Types.ObjectId, ref: 'Lesson', required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started',
    },
    completedAt: { type: Date },
    timeSpent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Cegah duplikat progres per user + pelajaran
lessonProgressSchema.index({ user: 1, lesson: 1 }, { unique: true });
lessonProgressSchema.index({ user: 1, course: 1 });

export default mongoose.model('LessonProgress', lessonProgressSchema);