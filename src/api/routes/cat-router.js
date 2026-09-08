import express from 'express';
import multer from 'multer';

import {
  getCats,
  getCat,
  postCat,
  putCat,
  deleteCat,
  getCatsByUser,
} from '../controllers/cat-controller.js';

import { authenticateToken } from '../../middlewares/authentication.js';

const catRouter = express.Router();

const upload = multer({ dest: 'uploads/' });

catRouter.get('/', getCats);

catRouter.get('/user/:id', getCatsByUser);

catRouter.get('/:id', getCat);

catRouter.post('/', upload.single('cat'), postCat);

catRouter.put('/:id', authenticateToken, putCat);

catRouter.delete('/:id', authenticateToken, deleteCat);

export default catRouter;
