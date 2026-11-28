// Jembatan antara Vercel Serverless Function dan Express app
import app from '../server/src/app.js';

// Vercel otomatis membungkus Express app sebagai handler
export default app;