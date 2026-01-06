const pool = require('../db');

const createRequest = async ({ instance_id, passenger_id, seats_requested }) => {
  const result = await pool.query(
    `
    INSERT INTO ride_requests
    (instance_id, passenger_id, seats_requested)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [instance_id, passenger_id, seats_requested]
  );
  return result.rows[0];
};

const findExisting = async (userId, instanceId) => {
  const res = await pool.query(
    `
    SELECT 1 FROM ride_requests
    WHERE passenger_id = $1
      AND instance_id = $2
      AND status IN ('pending', 'approved')
    `,
    [userId, instanceId]
  );
  return res.rows[0];
};

const getById = async (id) => {
  const res = await pool.query(
    `SELECT * FROM ride_requests WHERE id = $1`,
    [id]
  );
  return res.rows[0];
};

const updateStatus = async (id, status) => {
  await pool.query(
    `UPDATE ride_requests SET status = $1 WHERE id = $2`,
    [status, id]
  );
};

module.exports = {
  createRequest,
  findExisting,
  getById,
  updateStatus
};
