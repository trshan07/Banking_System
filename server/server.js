// server.js
const mongoose = require('mongoose');
const { app, httpServer } = require('./src/app');

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  console.error(err.stack);
  process.exit(1);
});

// Database connection - FIXED for MongoDB driver v5+
const connectDB = async () => {
  try {
    // ✅ FIXED: Remove deprecated options
    // In MongoDB driver v5+, these options are no longer needed as they're defaults
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/smartbank');

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`📦 MongoDB Version: ${conn.connection.serverVersion}`);

    // Create indexes (optional - uncomment if needed)
    // await conn.connection.syncIndexes();
    // console.log('✅ Database indexes synchronized');

    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.error('❌ Error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    process.exit(1);
  }
};

// Start server
const startServer = async () => {
  try {
    await connectDB();

    const PORT = process.env.PORT || 5000;
    
    const server = httpServer.listen(PORT, () => {
      console.log('\n=================================');
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`📡 API URL: http://localhost:${PORT}/api`);
      console.log(`🔑 Auth routes: http://localhost:${PORT}/api/auth`);
      console.log(`🏥 Health check: http://localhost:${PORT}/health`);
      console.log('=================================\n');
    });

    // Handle unhandled rejections
    process.on('unhandledRejection', (err) => {
      console.error('UNHANDLED REJECTION! 💥 Shutting down...');
      console.error(err.name, err.message);
      console.error(err.stack);
      server.close(() => {
        process.exit(1);
      });
    });

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
      server.close(() => {
        console.log('💥 HTTP server closed');
        mongoose.connection.close(false).then(() => {
          console.log('💥 MongoDB connection closed');
          process.exit(0);
        });
      });
    });

    process.on('SIGINT', () => {
      console.log('👋 SIGINT RECEIVED. Shutting down gracefully');
      server.close(() => {
        console.log('💥 HTTP server closed');
        mongoose.connection.close(false).then(() => {
          console.log('💥 MongoDB connection closed');
          process.exit(0);
        });
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();