import express from 'express';
import multer from 'multer';

import {
  getCats,
  getCat,
  postCat,
  putCat,
  deleteCat,
} from '../controllers/cat-controller.js';

const catRouter = express.Router();

const upload = multer({ dest: 'uploads/' });

catRouter.get('/', getCats);
catRouter.get('/:id', getCat);
catRouter.post('/', upload.single('cat'), postCat);
catRouter.put('/:id', putCat);
catRouter.delete('/:id', deleteCat);

export default catRouter;
