export const errorHandler = (err, req, res, next) => {
  console.error('❌ Error:', err.message);

  let statusCode = err.statusCode || 500;
  let message = err.message || 'Terjadi kesalahan pada server';
  let errors = [];

  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Data tidak valid';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  } else if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Format ID tidak valid';
  } else if (err.code === 11000) {
    statusCode = 409;
    const field = Object.keys(err.keyValue)[0];
    message = `${field} sudah terdaftar`;
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token tidak valid';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token sudah kadaluarsa';
  }

  const response = { success: false, message };
  if (errors.length > 0) response.errors = errors;

  res.status(statusCode).json(response);
};

export const notFound = (req, res, next) => {
  res.status(404);
  next(new Error(`Tidak ditemukan - ${req.originalUrl}`));
};