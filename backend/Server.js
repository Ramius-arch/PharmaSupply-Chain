const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const yaml = require('yamljs');
const path = require('path');

// Handle BigInt serialization globally
BigInt.prototype.toJSON = function () { return this.toString(); };

// Load configuration settings
const config = require('./config');

// Initialize Express app
const app = express();

// Security headers
app.use(helmet());

// Rate limiting — 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' }
});
app.use('/api', limiter);

// Enable CORS for all origins (portfolio PoC)
app.use(cors());

// Parse JSON request bodies
app.use(express.json({ limit: '10kb' }));

// Serve static files
app.use('/uploads', express.static('uploads'));

// Load API documentation from swagger.yaml
const swaggerDocument = yaml.load(path.join(__dirname, 'docs/swagger.yaml'));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Health check — always responds, reports DB connection state
app.get('/health', (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatus = ['disconnected', 'connected', 'connecting', 'disconnecting'][dbState] || 'unknown';
  res.status(200).json({
    status: 'ok',
    db: dbStatus,
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Mount API routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const productRoutes = require('./routes/product.routes');
const orderRoutes = require('./routes/order.routes');
const supplierRoutes = require('./routes/supplier.routes');
const blockchainRoutes = require('./routes/blockchain.routes');
const walletRoutes = require('./routes/wallet.routes');

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/blockchain', blockchainRoutes);
app.use('/api/wallet', walletRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({
    message: 'Something went wrong!',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
});

// Start HTTP server FIRST — Render health checks pass even during DB connect
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);

  // Connect to DB after server is listening (non-blocking startup)
  config.connectToDatabase()
    .catch((err) => {
      // Don't exit — retry logic in database.js will reconnect
      console.error('Initial DB connection failed, retrying in background:', err.message);
    });
});
