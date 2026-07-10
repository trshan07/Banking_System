const cloudinary = require('cloudinary').v2;

const isCloudinaryConfigured = () => Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET &&
  !String(process.env.CLOUDINARY_CLOUD_NAME).startsWith('your-') &&
  !String(process.env.CLOUDINARY_API_KEY).startsWith('your-') &&
  !String(process.env.CLOUDINARY_API_SECRET).startsWith('your-')
);

const configureCloudinary = () => {
  if (!isCloudinaryConfigured()) {
    console.warn('Cloudinary is not configured. Upload features that require cloud storage will return a clear configuration error.');
    return false;
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  console.log('Cloudinary configured');
  return true;
};

module.exports = configureCloudinary;
