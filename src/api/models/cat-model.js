const catItems = [
  {
    cat_id: 1,
    name: 'Milo',
    birthdate: '2022-05-10',
    weight: 4.5,
    owner: 'John Doe',
  },
  {
    cat_id: 2,
    name: 'Luna',
    birthdate: '2021-08-15',
    weight: 3.8,
    owner: 'Jane Doe',
  },
];

const getAllCats = () => {
  return catItems;
};

const getCatById = (id) => {
  return catItems.find((cat) => cat.cat_id === Number(id));
};

const addCat = (cat) => {
  const newCat = {
    cat_id: catItems.length + 1,
    ...cat,
  };

  catItems.push(newCat);
  return newCat;
};

export { getAllCats, getCatById, addCat };
