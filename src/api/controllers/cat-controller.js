import {
  getAllCats,
  getCatById,
  addCat,
  modifyCat,
  removeCat,
  getCatsByUserId as findCatsByUserId,
} from '../models/cat-model.js';

// Get all cats
const getCats = async (req, res, next) => {
  try {
    const cats = await getAllCats();
    res.json(cats);
  } catch (error) {
    next(error);
  }
};

// Get one cat
const getCat = async (req, res, next) => {
  try {
    const cat = await getCatById(req.params.id);

    if (!cat) {
      const error = new Error('Cat not found.');
      error.status = 404;
      return next(error);
    }

    res.json(cat);
  } catch (error) {
    next(error);
  }
};

// Add new cat
const postCat = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error('Invalid or missing file');
      error.status = 400;
      return next(error);
    }

    const cat = {
      ...req.body,
      filename: req.file.filename,
    };

    const result = await addCat(cat);

    if (!result) {
      const error = new Error('Cat was not added.');
      error.status = 400;
      return next(error);
    }

    res.status(201).json({
      message: 'New cat added.',
      ...result,
    });
  } catch (error) {
    next(error);
  }
};

// Update cat
const putCat = async (req, res, next) => {
  try {
    const loggedInUser = res.locals.user;

    const result = await modifyCat(req.body, req.params.id, loggedInUser);

    if (!result) {
      const error = new Error('Not allowed to update this cat.');
      error.status = 403;
      return next(error);
    }

    res.json({
      message: 'Cat item updated.',
    });
  } catch (error) {
    next(error);
  }
};

// Delete cat
const deleteCat = async (req, res, next) => {
  try {
    const loggedInUser = res.locals.user;

    const result = await removeCat(req.params.id, loggedInUser);

    if (!result) {
      const error = new Error('Not allowed to delete this cat.');
      error.status = 403;
      return next(error);
    }

    res.json({
      message: 'Cat item deleted.',
    });
  } catch (error) {
    next(error);
  }
};

// Get cats by user id
const getCatsByUser = async (req, res, next) => {
  try {
    const cats = await findCatsByUserId(req.params.id);
    res.json(cats);
  } catch (error) {
    next(error);
  }
};

export { getCats, getCat, postCat, putCat, deleteCat, getCatsByUser };
