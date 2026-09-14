import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { apiRouter } from './routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 5000;
const isProd = process.env.NODE_ENV === 'production';

// 1. Security Headers via Helmet
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows Vite inline scripts and styles in production
    crossOriginEmbedderPolicy: false
  })
);

// 2. CORS configuration
const allowedOrigin = process.env.ALLOWED_ORIGIN || '*';
app.use(
  cors({
    origin: allowedOrigin === '*' ? true : allowedOrigin,
    methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

// 3. Request rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Limit each IP to 200 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests from this IP, please try again after 15 minutes.' }
});
app.use('/api/', limiter);

// 4. Body parser with reasonable limits
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// 5. Mount API routes
app.use('/api', apiRouter);

// 6. Serve static client build in production
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

// 7. SPA catch-all fallback
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.status(200).send('NyayaPath Backend is active. Run "npm run dev" or build the client with "npm run build:client".');
    }
  });
});

// 8. Global Error Handler (Sanitized for safety)
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  const statusCode = err.status || 500;
  console.error(`[Server Error ${statusCode}]`, err.message || err);
  res.status(statusCode).json({
    error: isProd 
      ? 'An unexpected error occurred. Please try again later.' 
      : (err.message || 'Internal Server Error')
  });
});

// 9. Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`NyayaPath Server running on http://0.0.0.0:${PORT} in ${isProd ? 'production' : 'development'} mode`);
  console.log(`API Health: http://localhost:${PORT}/api/health`);
});

// 10. Graceful shutdown
const shutdown = () => {
  console.log('Received termination signal. Gracefully shutting down NyayaPath server...');
  server.close(() => {
    console.log('Server process terminated.');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export default app;
