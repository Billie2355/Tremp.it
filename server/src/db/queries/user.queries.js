const pool = require('../db');

const createUser = async ({ email, password, first_name, last_name, phone }) => {
  const result = await pool.query(
    `
    INSERT INTO users (email, password, first_name, last_name, phone, status)
    VALUES ($1, $2, $3, $4, $5, 'active')
    RETURNING *
    `,
    [email, password, first_name, last_name, phone]
  );
  return result.rows[0];
};

const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, email, first_name, last_name, phone FROM users WHERE status = 'active'`
  );
  return result.rows;
};

const getUserById = async (id) => {
  const result = await pool.query(
    `SELECT id, email, first_name, last_name, phone FROM users WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

const updateUser = async (id, { first_name, last_name, phone }) => {
  const result = await pool.query(
    `
    UPDATE users
    SET first_name = $1, last_name = $2, phone = $3
    WHERE id = $4
    RETURNING *
    `,
    [first_name, last_name, phone, id]
  );
  return result.rows[0];
};

const deactivateUser = async (id) => {
  await pool.query(
    `UPDATE users SET status = 'inactive' WHERE id = $1`,
    [id]
  );
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deactivateUser
};
