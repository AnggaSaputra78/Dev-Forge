import app from '../server/src/app.js';
import connectDB from '../server/src/config/database.js';

// Handler serverless: pastikan DB terhubung sebelum request diproses
export default async function handler(req, res) {
  await connectDB();
  return app(req, res);
}
