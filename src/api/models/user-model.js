import promisePool from '../../utils/database.js';

// Get all users
const getAllUsers = async () => {
  const [rows] = await promisePool.query('SELECT * FROM wsk_users');
  return rows;
};

// Get one user by id
const getUserById = async (id) => {
  const [rows] = await promisePool.execute(
    'SELECT * FROM wsk_users WHERE user_id = ?',
    [id],
  );

  if (rows.length === 0) {
    return false;
  }

  return rows[0];
};

// Add user
const addUser = async (user) => {
  const { name, username, email, password, role } = user;

  const sql = `
    INSERT INTO wsk_users
    (name, username, email, password, role)
    VALUES (?, ?, ?, ?, ?)
  `;

  const [result] = await promisePool.execute(sql, [
    name,
    username,
    email,
    password,
    role || 'user',
  ]);

  if (result.affectedRows === 0) {
    return false;
  }

  return { user_id: result.insertId };
};

// Update user
const modifyUser = async (user, id) => {
  const allowedFields = ['name', 'username', 'email', 'password', 'role'];

  const fields = [];
  const values = [];

  for (const key of allowedFields) {
    if (user[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(user[key]);
    }
  }

  if (fields.length === 0) {
    return false;
  }

  values.push(id);

  const sql = `
    UPDATE wsk_users
    SET ${fields.join(', ')}
    WHERE user_id = ?
  `;

  const [result] = await promisePool.execute(sql, values);

  if (result.affectedRows === 0) {
    return false;
  }

  return { message: 'success' };
};

// Delete user and their cats using a transaction
const removeUser = async (id) => {
  const connection = await promisePool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.execute('DELETE FROM wsk_cats WHERE owner = ?', [id]);

    const [result] = await connection.execute(
      'DELETE FROM wsk_users WHERE user_id = ?',
      [id],
    );

    if (result.affectedRows === 0) {
      await connection.rollback();
      return false;
    }

    await connection.commit();

    return { message: 'success' };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

export { getAllUsers, getUserById, addUser, modifyUser, removeUser };
