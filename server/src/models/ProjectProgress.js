import mongoose from 'mongoose';

const projectProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
    status: {
      type: String,
      enum: ['not_started', 'in_progress', 'completed'],
      default: 'not_started',
    },
    completedMilestones: [{ type: Number }],
    progress: { type: Number, default: 0, min: 0, max: 100 },
    startedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

projectProgressSchema.index({ user: 1, project: 1 }, { unique: true });

export default mongoose.model('ProjectProgress', projectProgressSchema);