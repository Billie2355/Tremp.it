const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db/db');

const register = async ({ email, password, first_name, last_name }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await pool.query(
    `
    INSERT INTO users (email, password, first_name, last_name, status)
    VALUES ($1, $2, $3, $4, 'active')
    RETURNING id, email
    `,
    [email, hashedPassword, first_name, last_name]
  );

  const token = jwt.sign(
    { userId: result.rows[0].id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return { user: result.rows[0], token };
};

const login = async ({ email, password }) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1 AND status = 'active'`,
    [email]
  );

  const user = result.rows[0];
  if (!user) throw new Error('Invalid credentials');

  const match = await bcrypt.compare(password, user.password);
  if (!match) throw new Error('Invalid credentials');

  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  return {
    user: { id: user.id, email: user.email },
    token
  };
};

module.exports = { register, login };
