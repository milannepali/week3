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

const catRouter = express.Router();

const upload = multer({ dest: 'uploads/' });

// Get all cats
catRouter.get('/', getCats);

// Get cats by user id
catRouter.get('/user/:id', getCatsByUser);

// Get one cat by cat id
catRouter.get('/:id', getCat);

// Add new cat with image
catRouter.post('/', upload.single('cat'), postCat);

// Update cat
catRouter.put('/:id', putCat);

// Delete cat
catRouter.delete('/:id', deleteCat);

export default catRouter;
