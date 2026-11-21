import mongoose from 'mongoose';

const challengeSubmissionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'CodingChallenge', required: true },
    code: { type: String, required: true },
    language: { type: String, default: 'javascript' },
    status: {
      type: String,
      enum: ['pending', 'running', 'passed', 'failed', 'error'],
      default: 'pending',
    },
    testResults: [
      {
        testCaseIndex: Number,
        passed: Boolean,
        input: mongoose.Schema.Types.Mixed,
        expected: mongoose.Schema.Types.Mixed,
        actual: mongoose.Schema.Types.Mixed,
        error: String,
      },
    ],
    passedTests: { type: Number, default: 0 },
    totalTests: { type: Number, default: 0 },
    executionTime: { type: Number, default: 0 },
    errorMessage: { type: String, default: '' },
    pointsEarned: { type: Number, default: 0 },
    isFirstSuccess: { type: Boolean, default: false },
  },
  { timestamps: true }
);

challengeSubmissionSchema.index({ user: 1, challenge: 1, createdAt: -1 });

export default mongoose.model('ChallengeSubmission', challengeSubmissionSchema);