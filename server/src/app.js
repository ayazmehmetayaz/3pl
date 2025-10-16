const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { errorHandler } = require('./middleware/errorHandler');
const { logger } = require('./utils/logger');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const wmsRoutes = require('./routes/wmsRoutes');
const tmsRoutes = require('./routes/tmsRoutes');
const accountingRoutes = require('./routes/accountingRoutes');
const marketingRoutes = require('./routes/marketingRoutes');
const hrRoutes = require('./routes/hrRoutes');
const reportingRoutes = require('./routes/reportingRoutes');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Compression
app.use(compression());

// Logging
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/wms', wmsRoutes);
app.use('/api/tms', tmsRoutes);
app.use('/api/accounting', accountingRoutes);
app.use('/api/marketing', marketingRoutes);
app.use('/api/hr', hrRoutes);
app.use('/api/reporting', reportingRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handling
app.use(errorHandler);

const PORT = process.env.PORT || 3001;

// Sadece lokal ortamda dinleme aktif
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    logger.info(`🚀 Ayaz Lojistik ERP Server running on port ${PORT}`);
    logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
}

module.exports = app;
