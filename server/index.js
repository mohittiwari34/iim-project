import express from 'express';
import cors from 'cors';
import { config } from './config/env.js';
import analyzeRoute from './routes/analyzeRoute.js';
import errorHandler from './middleware/errorHandler.js';

// Initialize the Express app
const app = express();

// Enable Cross-Origin Resource Sharing for all origins
app.use(cors());

// Body parser middleware for JSON payloads
app.use(express.json());

// Log incoming requests in dev mode
if (config.nodeEnv === 'development') {
  app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
  });
}

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    env: config.nodeEnv,
  });
});

// API Routes
app.use('/api', analyzeRoute);

// Catch 404 routes and forward to error handler
app.use((req, res, next) => {
  const err = new Error(`Endpoint ${req.method} ${req.originalUrl} Not Found`);
  err.statusCode = 404;
  next(err);
});

// Global Error Handler Middleware (must be registered last)
app.use(errorHandler);

// Start listening
const server = app.listen(config.port, () => {
  console.log(`==================================================`);
  console.log(` AI Investment Research Backend Server Running    `);
  console.log(` Port: ${config.port}                               `);
  console.log(` Environment: ${config.nodeEnv}                   `);
  console.log(`==================================================`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
