import mongoose from 'mongoose';

const aiConversationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mode: {
      type: String,
      enum: ['Mode Mandiri', 'Mode Bantuan AI', 'Mode Tinjauan'],
      default: 'Mode Mandiri',
    },
    action: {
      type: String,
      enum: [
        'Jelaskan Kode',
        'Asisten Debug',
        'Buat Petunjuk',
        'Tinjauan Kode',
        'Penjelasan Konsep',
        'Pertanyaan Bebas',
      ],
      required: true,
    },
    messages: [
      {
        role: { type: String, enum: ['user', 'assistant'], required: true },
        content: { type: String, required: true },
        codeSnippet: { type: String, default: '' },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

aiConversationSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model('AIConversation', aiConversationSchema);