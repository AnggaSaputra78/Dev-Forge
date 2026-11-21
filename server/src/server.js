import app from './app.js';
import connectDB from './config/database.js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Ambil lokasi file saat ini (untuk ESM modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env dari folder server/ (parent dari src/)
dotenv.config({ path: join(__dirname, '../.env') });

// DEBUG: Cek apakah env ter-load
console.log('🔍 Mengecek environment variables...');
if (!process.env.MONGODB_URI) {
  console.error('❌ MONGODB_URI tidak ditemukan!');
  console.error('📂 Lokasi .env yang dicoba:', join(__dirname, '../.env'));
  process.exit(1);
}
console.log('✅ Environment variables berhasil dimuat');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log('');
      console.log('╔══════════════════════════════════════════╗');
      console.log('║    🚀 DevForge Academy Server            ║');
      console.log('╠══════════════════════════════════════════╣');
      console.log(`║  📍 http://localhost:${PORT}                 ║`);
      console.log(`║  🌍 Lingkungan: ${process.env.NODE_ENV || 'development'}`);
      console.log('╚══════════════════════════════════════════╝');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Gagal memulai server:', error);
    process.exit(1);
  }
};

startServer();