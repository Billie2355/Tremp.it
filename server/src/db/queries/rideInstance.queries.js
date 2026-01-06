const pool = require('../db');

const createInstance = async ({
  ride_id,
  ride_date,
  departure_time,
  seats_available
}) => {
  const result = await pool.query(
    `
    INSERT INTO ride_instances
    (ride_id, ride_date, departure_time, seats_available)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    [ride_id, ride_date, departure_time, seats_available]
  );

  return result.rows[0];
};

const getByRideId = async (rideId) => {
    const res = await pool.query(
      `SELECT * FROM ride_instances WHERE ride_id = $1`,
      [rideId]
    );
    return res.rows[0];
  };
  
  const getById = async (id) => {
    const res = await pool.query(
      `SELECT * FROM ride_instances WHERE id = $1`,
      [id]
    );
    return res.rows[0];
  };
  
  const decreaseSeats = async (instanceId, seats) => {
    await pool.query(
      `
      UPDATE ride_instances
      SET seats_available = seats_available - $1
      WHERE id = $2
      `,
      [seats, instanceId]
    );
  };

  const increaseSeats = async (instanceId, seats) => {
    await pool.query(
      `
      UPDATE ride_instances
      SET seats_available = seats_available + $1
      WHERE id = $2
      `,
      [seats, instanceId]
    );
  };

module.exports = { createInstance, getByRideId, getById, decreaseSeats, increaseSeats };
