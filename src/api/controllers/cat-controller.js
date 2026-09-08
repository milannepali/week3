import {
  getAllCats,
  getCatById,
  addCat,
  modifyCat,
  removeCat,
  getCatsByUserId as findCatsByUserId,
} from '../models/cat-model.js';

// Get all cats
const getCats = async (req, res) => {
  try {
    const cats = await getAllCats();
    res.json(cats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
};

// Get one cat
const getCat = async (req, res) => {
  try {
    const cat = await getCatById(req.params.id);

    if (!cat) {
      return res.status(404).json({ message: 'Cat not found.' });
    }

    res.json(cat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
};

// Add new cat
const postCat = async (req, res) => {
  try {
    const cat = {
      ...req.body,
      filename: req.file?.filename,
    };

    const result = await addCat(cat);

    if (!result) {
      return res.status(400).json({ message: 'Cat was not added.' });
    }

    res.status(201).json({
      message: 'New cat added.',
      ...result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
};

// Update cat
const putCat = async (req, res) => {
  try {
    const loggedInUser = res.locals.user;

    const result = await modifyCat(req.body, req.params.id, loggedInUser);

    if (!result) {
      return res.status(403).json({
        message: 'Not allowed to update this cat.',
      });
    }

    res.json({ message: 'Cat item updated.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
};

// Delete cat
const deleteCat = async (req, res) => {
  try {
    const loggedInUser = res.locals.user;

    const result = await removeCat(req.params.id, loggedInUser);

    if (!result) {
      return res.status(403).json({
        message: 'Not allowed to delete this cat.',
      });
    }

    res.json({ message: 'Cat item deleted.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
};

// Get cats by user id
const getCatsByUser = async (req, res) => {
  try {
    const cats = await findCatsByUserId(req.params.id);
    res.json(cats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Database error' });
  }
};

export { getCats, getCat, postCat, putCat, deleteCat, getCatsByUser };
