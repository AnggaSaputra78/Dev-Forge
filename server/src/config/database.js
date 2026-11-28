import mongoose from 'mongoose';

// Cache koneksi di global agar dipakai ulang antar-invocation serverless
let cached = global.mongooseCache;
if (!cached) {
  cached = global.mongooseCache = { conn: null, promise: null };
}

const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 5,
      serverSelectionTimeoutMS: 8000,
    });
  }

  try {
    cached.conn = await cached.promise;
    console.log('✅ MongoDB terhubung:', cached.conn.connection.host);
  } catch (err) {
    cached.promise = null;
    console.error('❌ Gagal koneksi MongoDB:', err.message);
    throw err;
  }

  return cached.conn;
};

export default connectDB;