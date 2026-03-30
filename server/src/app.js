// src/app.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
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
const { generalLimiter } = require('./middleware/rateLimiter');

const app = express();
const httpServer = createServer(app);

// ============================================
// CORS Configuration - FIXED FOR EXPRESS 5
// ============================================

// Allowed origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:3004',
  'http://localhost:3005',
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:3002',
  'http://127.0.0.1:3003',
  'http://127.0.0.1:3004',
  'http://127.0.0.1:3005',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
  'http://127.0.0.1:5175',
  process.env.FRONTEND_URL
].filter(Boolean);

// CORS options
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, curl)
    if (!origin) {
      return callback(null, true);
    }
    
    // Check if origin is in allowedOrigins array
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV === 'development') {
      callback(null, true);
    } else {
      console.log('🚫 CORS blocked origin:', origin);
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin',
    'X-CSRF-Token'
  ],
  exposedHeaders: ['Content-Range', 'X-Content-Range', 'Authorization']
};

// ✅ FIXED: Apply CORS middleware WITHOUT using '*' pattern
app.use(cors(corsOptions));

// ✅ FIXED: Handle preflight requests properly using middleware
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin, X-CSRF-Token');
    res.header('Access-Control-Allow-Credentials', 'true');
    return res.status(200).json({});
  }
  next();
});

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.url}`);
  next();
});

// ============================================
// Security & Utility Middleware
// ============================================

// Add cookie parser middleware
app.use(cookieParser());

// Security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
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

// Apply rate limiting to all routes
app.use(generalLimiter);

// Audit logging
app.use(auditLogger);

// ============================================
// Static Files
// ============================================

// Serve uploaded files
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

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is working',
    timestamp: new Date()
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
// Socket.IO Setup - FIXED
// ============================================

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST']
  },
  transports: ['polling', 'websocket'], // Try polling first, then upgrade to websocket
  allowEIO3: true, // Allow Engine.IO v3 clients
  pingTimeout: 60000,
  pingInterval: 25000
});

// Socket.IO middleware for authentication
io.use((socket, next) => {
  const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
  
  if (!token) {
    // Don't reject, just mark as unauthenticated
    socket.isAuthenticated = false;
    return next();
  }
  
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || process.env.JWT_ACCESS_SECRET);
    socket.userId = decoded.id;
    socket.userRole = decoded.role;
    socket.isAuthenticated = true;
    next();
  } catch (err) {
    console.error('Socket auth error:', err);
    socket.isAuthenticated = false;
    next(); // Don't reject, just mark as unauthenticated
  }
});

io.on('connection', (socket) => {
  console.log('🔌 Socket connected:', socket.id, 'Authenticated:', socket.isAuthenticated);
  
  if (socket.isAuthenticated && socket.userId) {
    socket.join(`user:${socket.userId}`);
    console.log(`✅ User ${socket.userId} joined room user:${socket.userId}`);
  }
  
  if (socket.userRole) {
    socket.join(`role:${socket.userRole}`);
  }
  
  socket.on('disconnect', () => {
    console.log('🔌 Socket disconnected:', socket.id);
  });
  
  socket.on('error', (error) => {
    console.error('Socket error:', error);
  });
});

// Make io available to routes
app.set('io', io);

// ============================================
// ✅ FIXED: 404 Handler for Express 5
// ============================================

// IMPORTANT: In Express 5 with path-to-regexp@8.x, we CANNOT use:
// - app.all('*', ...)
// - app.use('*', ...)
// - app.options('*', ...)
//
// Instead, we use middleware functions that don't rely on route patterns

// This middleware catches all requests that weren't handled by previous routes
app.use((req, res, next) => {
  // Skip if response has already been sent
  if (res.headersSent) {
    return next();
  }
  
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
    method: req.method,
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// ============================================
// Error Handling Middleware
// ============================================

app.use(errorHandler);

// ============================================
// Export
// ============================================

module.exports = { app, httpServer, io };