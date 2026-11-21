import AIConversation from '../models/AIConversation.js';
import aiService from '../services/ai.service.js';
import asyncHandler from '../utils/asyncHandler.js';

// @desc    Kirim pesan ke Mentor AI
// @route   POST /api/mentor/chat
// @access  Privat
export const chat = asyncHandler(async (req, res) => {
  const { action, message, codeSnippet, mode } = req.body;

  if (!message || !message.trim()) {
    res.status(400);
    throw new Error('Pesan wajib diisi');
  }

  const aiResponse = await aiService.generateResponse(action, message, codeSnippet);

  const conversation = await AIConversation.create({
    user: req.user._id,
    mode: mode || 'Mode Mandiri',
    action,
    messages: [
      { role: 'user', content: message, codeSnippet: codeSnippet || '' },
      { role: 'assistant', content: aiResponse },
    ],
  });

  res.json({
    success: true,
    data: {
      conversationId: conversation._id,
      response: aiResponse,
      isConfigured: aiService.isConfigured,
    },
  });
});

// @desc    Ambil riwayat percakapan
// @route   GET /api/mentor/history
// @access  Privat
export const getHistory = asyncHandler(async (req, res) => {
  const { limit = 20 } = req.query;

  const conversations = await AIConversation.find({ user: req.user._id })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit));

  res.json({ success: true, count: conversations.length, data: conversations });
});

// @desc    Cek status konfigurasi AI
// @route   GET /api/mentor/status
// @access  Privat
export const getStatus = asyncHandler(async (req, res) => {
  res.json({
    success: true,
    data: {
      isConfigured: aiService.isConfigured,
      provider: aiService.provider,
      message: aiService.isConfigured
        ? 'Layanan AI terkonfigurasi dan siap digunakan'
        : 'Layanan AI belum dikonfigurasi. Respons menggunakan template pembelajaran statis.',
    },
  });
});