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

const getByPassengerId = async (passengerId) => {
  const res = await pool.query(
    `
    SELECT 
      rr.id AS request_id,
      rr.status,
      rr.seats_requested,

      ri.id AS instance_id,
      ri.ride_date,
      ri.departure_time,

      r.origin,
      r.destination,

      u.id AS driver_id,
      u.first_name || ' ' || u.last_name AS driver_name

    FROM ride_requests rr
    JOIN ride_instances ri ON rr.instance_id = ri.id
    JOIN rides r ON ri.ride_id = r.id
    JOIN users u ON r.driver_id = u.id

    WHERE rr.passenger_id = $1
    ORDER BY ri.ride_date, ri.departure_time
    `,
    [passengerId]
  );

  return res.rows;
};


module.exports = {
  createRequest,
  findExisting,
  getById,
  updateStatus,
  getByPassengerId
};
