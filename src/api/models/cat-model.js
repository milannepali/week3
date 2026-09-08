import promisePool from '../../utils/database.js';

// Get all cats + owner's name
const getAllCats = async () => {
  const [rows] = await promisePool.query(`
    SELECT wsk_cats.*, wsk_users.name AS owner_name
    FROM wsk_cats
    JOIN wsk_users ON wsk_cats.owner = wsk_users.user_id
  `);

  return rows;
};

// Get one cat by id + owner's name
const getCatById = async (id) => {
  const [rows] = await promisePool.execute(
    `SELECT wsk_cats.*, wsk_users.name AS owner_name
     FROM wsk_cats
     JOIN wsk_users ON wsk_cats.owner = wsk_users.user_id
     WHERE wsk_cats.cat_id = ?`,
    [id],
  );

  if (rows.length === 0) {
    return false;
  }

  return rows[0];
};

// Add new cat
const addCat = async (cat) => {
  const { cat_name, weight, owner, filename, birthdate } = cat;

  const sql = `
    INSERT INTO wsk_cats
    (cat_name, weight, owner, filename, birthdate)
    VALUES (?, ?, ?, ?, ?)
  `;

  const [result] = await promisePool.execute(sql, [
    cat_name,
    weight,
    owner,
    filename,
    birthdate,
  ]);

  if (result.affectedRows === 0) {
    return false;
  }

  return { cat_id: result.insertId };
};

// Update cat
const modifyCat = async (cat, id, user) => {
  const allowedFields = [
    'cat_name',
    'weight',
    'owner',
    'filename',
    'birthdate',
  ];

  const fields = [];
  const values = [];

  for (const key of allowedFields) {
    if (cat[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(cat[key]);
    }
  }

  if (fields.length === 0) {
    return false;
  }

  let sql;

  // Admin can update any cat
  if (user.role === 'admin') {
    sql = `
      UPDATE wsk_cats
      SET ${fields.join(', ')}
      WHERE cat_id = ?
    `;

    values.push(id);
  } else {
    // Regular user can update only their own cat
    sql = `
      UPDATE wsk_cats
      SET ${fields.join(', ')}
      WHERE cat_id = ? AND owner = ?
    `;

    values.push(id, user.user_id);
  }

  const [result] = await promisePool.execute(sql, values);

  if (result.affectedRows === 0) {
    return false;
  }

  return { message: 'success' };
};

// Delete cat
const removeCat = async (id, user) => {
  let sql;
  let params;

  // Admin can delete any cat
  if (user.role === 'admin') {
    sql = 'DELETE FROM wsk_cats WHERE cat_id = ?';
    params = [id];
  } else {
    // Regular user can delete only their own cat
    sql = 'DELETE FROM wsk_cats WHERE cat_id = ? AND owner = ?';
    params = [id, user.user_id];
  }

  const [result] = await promisePool.execute(sql, params);

  if (result.affectedRows === 0) {
    return false;
  }

  return { message: 'success' };
};

// Get cats by user id
const getCatsByUserId = async (userId) => {
  const [rows] = await promisePool.execute(
    `SELECT wsk_cats.*, wsk_users.name AS owner_name
     FROM wsk_cats
     JOIN wsk_users ON wsk_cats.owner = wsk_users.user_id
     WHERE wsk_cats.owner = ?`,
    [userId],
  );

  return rows;
};

export {
  getAllCats,
  getCatById,
  addCat,
  modifyCat,
  removeCat,
  getCatsByUserId,
};
