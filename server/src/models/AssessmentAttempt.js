import mongoose from 'mongoose';

const assessmentAttemptSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    assessment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
    answers: [
      {
        questionIndex: Number,
        answer: mongoose.Schema.Types.Mixed,
        isCorrect: Boolean,
        pointsEarned: Number,
      },
    ],
    score: { type: Number, default: 0, min: 0, max: 100 },
    totalPoints: { type: Number, default: 0 },
    pointsEarned: { type: Number, default: 0 },
    passed: { type: Boolean, default: false },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    timeTaken: { type: Number },
    attemptNumber: { type: Number, default: 1 },
  },
  { timestamps: true }
);

assessmentAttemptSchema.index({ user: 1, assessment: 1 });

export default mongoose.model('AssessmentAttempt', assessmentAttemptSchema);