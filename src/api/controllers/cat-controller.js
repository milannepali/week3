import { getAllCats, getCatById, addCat } from '../models/cat-model.js';

const getCats = (req, res) => {
  res.json(getAllCats());
};

const getCat = (req, res) => {
  const cat = getCatById(req.params.id);

  if (cat) {
    res.json(cat);
  } else {
    res.status(404).json({ message: 'Cat not found.' });
  }
};

const postCat = (req, res) => {
  const newCat = addCat(req.body);
  res.status(201).json(newCat);
};

const putCat = (req, res) => {
  res.json({ message: 'Cat item updated.' });
};

const deleteCat = (req, res) => {
  res.json({ message: 'Cat item deleted.' });
};

export { getCats, getCat, postCat, putCat, deleteCat };
