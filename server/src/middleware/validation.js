const { validationResult } = require('express-validator');
const fs = require('fs');

const validate = async (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const uploadedFiles = [
      ...(req.files || []),
      ...(req.file ? [req.file] : [])
    ];
    await Promise.all(uploadedFiles.map((file) => fs.promises.unlink(file.path).catch(() => {})));

    const formattedErrors = {};
    
    errors.array().forEach(error => {
      if (!formattedErrors[error.path]) {
        formattedErrors[error.path] = error.msg;
      }
    });

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors
    });
  }
  
  next();
};

module.exports = { validate };
