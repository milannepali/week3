import express from 'express';
import api from './api/index.js';

import { notFoundHandler, errorHandler } from './middlewares/error-handlers.js';

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Serve files from public folder
app.use('/public', express.static('public'));

// Home route
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// API routes
app.use('/api/v1', api);

// Handle routes that do not exist
app.use(notFoundHandler);

// Error handler MUST be last
app.use(errorHandler);

export default app;
