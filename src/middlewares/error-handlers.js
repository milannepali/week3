import { validationResult } from 'express-validator';

// Handle validation errors
const validationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const messages = errors
      .array()
      .map((error) => `${error.path}: ${error.msg}`)
      .join(', ');

    const error = new Error(messages);
    error.status = 400;

    return next(error);
  }

  next();
};

// Handle routes that do not exist
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  error.status = 404;
  next(error);
};

// Main error handler
const errorHandler = (err, req, res, next) => {
  // Multer file too large error
  if (err.code === 'LIMIT_FILE_SIZE') {
    err.status = 400;
    err.message = 'File too large. Maximum size is 10 MB.';
  }

  res.status(err.status || 500);

  res.json({
    error: {
      message: err.message,
      status: err.status || 500,
    },
  });
};

export { validationErrors, notFoundHandler, errorHandler };
