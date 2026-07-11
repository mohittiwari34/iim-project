import { config } from '../config/env.js';

/**
 * Express error handler middleware.
 * Intercepts any uncaught errors in controllers and routes.
 */
export default function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'An unexpected error occurred';

  console.error(`[ERROR] ${req.method} ${req.url} - Status ${statusCode}:`, err);

  res.status(statusCode).json({
    success: false,
    error: message,
    // Provide stack trace only in development
    stack: config.nodeEnv === 'development' ? err.stack : undefined,
  });
}
