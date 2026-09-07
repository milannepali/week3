import express from 'express';
import api from './api/index.js';

const app = express();

app.use(express.json());

app.use('/public', express.static('public'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.use('/api/v1', api);

export default app;
