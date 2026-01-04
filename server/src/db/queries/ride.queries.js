const pool = require('../db');

const createRide = async ({
  driver_id,
  car_id,
  origin,
  destination,
  departure_time,
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
      seats_offering,
      price,
      is_recurring,
      status
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, false, 'active')
    RETURNING *
    `,
    [
      driver_id,
      car_id,
      origin,
      destination,
      departure_time,
      seats_offering,
      price ?? 0
    ]
  );

  return result.rows[0];
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

module.exports = {
  createRide,
  searchRides
};
