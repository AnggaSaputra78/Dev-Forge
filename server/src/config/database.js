import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`✅ MongoDB terhubung: ${conn.connection.host}`);

    mongoose.connection.on('error', (err) => {
      console.error('❌ Error koneksi MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ Koneksi MongoDB terputus');
    });
  } catch (error) {
    console.error('❌ Gagal menghubungkan ke MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB;