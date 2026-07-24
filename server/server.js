const mongoose = require('mongoose');
const { app, httpServer } = require('./src/app');
const { ensureSuperAdmin, ensureDemoUsers } = require('./src/seed');

process.on('uncaughtException', (error) => {
  console.error('Uncaught exception. Shutting down.', error);
  process.exit(1);
});

const connectDB = async () => {
  if (!process.env.MONGODB_URI) {
    throw new Error('MONGODB_URI is required');
  }

  const connection = await mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: Number(process.env.DB_CONNECT_TIMEOUT_MS || 10000),
    maxPoolSize: Number(process.env.DB_MAX_POOL_SIZE || 20),
    autoIndex: process.env.NODE_ENV !== 'production'
  });
  const topology = await connection.connection.db.admin().command({ hello: 1 });
  if (process.env.NODE_ENV === 'production' && !topology.setName) {
    throw new Error('Production MongoDB must be configured as a replica set');
  }
  console.log(`MongoDB connected: ${connection.connection.host}/${connection.connection.name}`);
  return connection;
};

const startServer = async () => {
  await connectDB();
  await ensureSuperAdmin();
  await ensureDemoUsers();

  const port = Number(process.env.PORT || 5000);
  const server = await new Promise((resolve, reject) => {
    const candidate = httpServer.listen(port, () => resolve(candidate));
    candidate.once('error', reject);
  });

  console.log(`Server listening on port ${port} (${process.env.NODE_ENV || 'development'})`);

  const shutdown = (signal, exitCode = 0) => {
    console.log(`${signal} received. Shutting down.`);
    const forceTimer = setTimeout(() => {
      console.error('Graceful shutdown timed out.');
      process.exit(1);
    }, Number(process.env.SHUTDOWN_TIMEOUT_MS || 10000));
    forceTimer.unref();

    server.close(async () => {
      try {
        await mongoose.connection.close(false);
        clearTimeout(forceTimer);
        process.exit(exitCode);
      } catch (error) {
        console.error('Database shutdown failed.', error);
        process.exit(1);
      }
    });
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('unhandledRejection', (error) => {
    console.error('Unhandled rejection.', error);
    shutdown('unhandledRejection', 1);
  });
};

startServer().catch((error) => {
  console.error('Failed to start server.', error);
  process.exit(1);
});
