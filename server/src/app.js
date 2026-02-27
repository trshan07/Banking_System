// src/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const branchRoutes = require('./routes/branchRoutes');
const accountRoutes = require('./routes/accountRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const loanRoutes = require('./routes/loanRoutes');
const documentRoutes = require('./routes/documentRoutes');
const kycRoutes = require('./routes/kycRoutes');
const supportRoutes = require('./routes/supportRoutes');
const savingsRoutes = require('./routes/savingsRoutes');
const employeeRoutes = require('./routes/employeeRoutes');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const { authMiddleware } = require('./middleware/auth');
const auditLogger = require('./middleware/auditLogger');

const app = express();
const httpServer = createServer(app);

// ============================================
// CORS Configuration - FIXED FOR PORT 3001
// ============================================

// Allowed origins - ADD YOUR FRONTEND PORTS HERE
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:3002',
  process.env.FRONTEND_URL
].filter(Boolean); // Remove any undefined values

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in allowedOrigins array
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      // Log blocked origins for debugging
      console.log('🚫 CORS blocked origin:', origin);
      console.log('✅ Allowed origins:', allowedOrigins);
      
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true, // Allow cookies and authentication headers
  optionsSuccessStatus: 200, // For legacy browser support
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

// Apply CORS middleware
app.use(cors(corsOptions));

// 🔧 FIXED: Removed the problematic app.options('*', cors(corsOptions)) line
// The app.use(cors) above already handles preflight requests automatically

// Logging middleware for debugging CORS
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url} - Origin: ${req.headers.origin || 'No Origin'}`);
  next();
});

// ============================================
// Security & Utility Middleware
// ============================================

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" } // Allow cross-origin resources
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Audit logging
app.use(auditLogger);

// ============================================
// Static Files
// ============================================

// Serve uploaded files (if any)
app.use('/uploads', express.static('uploads'));

// ============================================
// API Routes
// ============================================

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development',
    cors: {
      allowedOrigins,
      currentOrigin: req.headers.origin || 'No origin'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/branches', branchRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/loans', loanRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/kyc', kycRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/savings', savingsRoutes);
app.use('/api/employee', employeeRoutes);

// ============================================
// Socket.IO Setup (if needed)
// ============================================

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

// Socket.IO middleware for authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Authentication error'));
  }
  
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.userId = decoded.id;
    next();
  } catch (err) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket) => {
  console.log('🔌 New client connected:', socket.id);
  
  socket.join(`user:${socket.userId}`);
  
  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// Make io available to routes
app.set('io', io);

// ============================================
// 404 Handler - FIXED WILDCARD SYNTAX
// ============================================

// Catch-all for all unmatched routes (works with Express 5)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    method: req.method,
    timestamp: new Date().toISOString()
  });
});
// ============================================
// Error Handling Middleware (must be last)
// ============================================

app.use(errorHandler);

// ============================================
// Export
// ============================================

module.exports = { app, httpServer, io };