import express from 'express';

import {
  getCats,
  getCat,
  postCat,
  putCat,
  deleteCat,
} from '../controllers/cat-controller.js';

const catRouter = express.Router();

catRouter.get('/', getCats);
catRouter.get('/:id', getCat);
catRouter.post('/', postCat);
catRouter.put('/:id', putCat);
catRouter.delete('/:id', deleteCat);

export default catRouter;
