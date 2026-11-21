import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: [
        'pelajaran_selesai',
        'tantangan_selesai',
        'proyek_selesai',
        'asesmen_selesai',
        'kursus_selesai',
        'login',
        'milestone_selesai',
      ],
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    referenceId: { type: mongoose.Schema.Types.ObjectId, refPath: 'referenceModel' },
    referenceModel: {
      type: String,
      enum: ['Lesson', 'CodingChallenge', 'Project', 'Assessment', 'Course'],
    },
    metadata: {
      score: Number,
      points: Number,
      timeSpent: Number,
    },
  },
  { timestamps: true }
);

activitySchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('Activity', activitySchema);