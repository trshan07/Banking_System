const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

require('dotenv').config({ path: path.resolve(__dirname, '..', '..', '.env') });
const { validateEnvironment } = require('../config/environment');

const loadModels = () => {
  const modelsDirectory = path.resolve(__dirname, '..', 'models');
  for (const file of fs.readdirSync(modelsDirectory)) {
    if (file.endsWith('.js')) {
      require(path.join(modelsDirectory, file));
    }
  }
};

const migrate = async () => {
  validateEnvironment();
  if (!process.env.MONGODB_URI) throw new Error('MONGODB_URI is required');

  await mongoose.connect(process.env.MONGODB_URI);
  const topology = await mongoose.connection.db.admin().command({ hello: 1 });
  if (process.env.NODE_ENV === 'production' && !topology.setName) {
    throw new Error('Production MongoDB must be a replica set to support atomic transfers');
  }

  loadModels();
  for (const model of Object.values(mongoose.models)) {
    await model.createIndexes();
    console.log(`Indexes ensured for ${model.modelName}`);
  }
};

migrate()
  .then(async () => {
    await mongoose.disconnect();
    console.log('Database migration completed');
  })
  .catch(async (error) => {
    console.error('Database migration failed:', error);
    await mongoose.disconnect().catch(() => {});
    process.exit(1);
  });
