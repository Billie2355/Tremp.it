const pool = require('../db');

const getRoleByName = async (name) => {
  const result = await pool.query(
    `SELECT id, name FROM roles WHERE name = $1`,
    [name]
  );
  return result.rows[0];
};

const assignRoleToUser = async (userId, roleId) => {
  await pool.query(
    `INSERT INTO user_roles (user_id, role_id)
     VALUES ($1, $2)`,
    [userId, roleId]
  );
};

module.exports = {
  getRoleByName,
  assignRoleToUser
};
