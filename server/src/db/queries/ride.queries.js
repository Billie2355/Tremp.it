const pool = require('../db');

const createRide = async ({
  driver_id,
  car_id,
  origin,
  destination,
  departure_time,
  start_date,
  seats_offering,
  price
}) => {
  const result = await pool.query(
    `
    INSERT INTO rides (
      driver_id,
      car_id,
      origin,
      destination,
      departure_time,
      start_date,
      seats_offering,
      price,
      is_recurring,
      status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, false, 'active')
    RETURNING *
    `,
    [
      driver_id,
      car_id,
      origin,
      destination,
      departure_time,
      start_date,
      seats_offering,
      price ?? 0
    ]
  );

  return result.rows[0];
};

const getByDriverId = async (driverId) => {
  const res = await pool.query(
    `
    SELECT
      r.id AS ride_id,
      ri.id AS instance_id,
      ri.ride_date,
      ri.departure_time,
      ri.seats_available,
      r.origin,
      r.destination,
      r.price,

      COUNT(rr.id) FILTER (WHERE rr.status = 'pending') AS pending_requests

    FROM rides r
    JOIN ride_instances ri ON ri.ride_id = r.id
    LEFT JOIN ride_requests rr ON rr.instance_id = ri.id

    WHERE r.driver_id = $1
    GROUP BY r.id, ri.id
    ORDER BY ri.ride_date, ri.departure_time
    `,
    [driverId]
  );

  return res.rows;
};

const searchRides = async ({
  origin,
  destination,
  time_from,
  time_to
}) => {
  let query = `
    SELECT
      r.id,
      r.origin,
      r.destination,
      r.departure_time,
      r.price,
      r.seats_offering,
      u.first_name AS driver_first_name,
      u.last_name AS driver_last_name
    FROM rides r
    JOIN users u ON r.driver_id = u.id
    WHERE
      r.status = 'active'
      AND r.origin ILIKE $1
      AND r.destination ILIKE $2
  `;

  const values = [`%${origin}%`, `%${destination}%`];
  let idx = 3;

  if (time_from) {
    query += ` AND r.departure_time >= $${idx++}`;
    values.push(time_from);
  }

  if (time_to) {
    query += ` AND r.departure_time <= $${idx++}`;
    values.push(time_to);
  }

  query += ` ORDER BY r.departure_time ASC`;

  const result = await pool.query(query, values);
  return result.rows;
};

const getRideById = async (id) => {
  const res = await pool.query(
    `SELECT * FROM rides WHERE id = $1`,
    [id]
  );
  return res.rows[0];
};

const decreaseSeats = async (rideId, seats) => {
  await pool.query(
    `
    UPDATE rides
    SET seats_offering = seats_offering - $1
    WHERE id = $2
    `,
    [seats, rideId]
  );
};


module.exports = {
  createRide,
  searchRides,
  getRideById,
  decreaseSeats,
  getByDriverId
};
