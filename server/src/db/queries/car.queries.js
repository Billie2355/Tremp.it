const pool = require('../db');

const createCar = async ({ user_id, car_model, car_color, license_plate, seats }) => {
  const result = await pool.query(
    `
    INSERT INTO cars (user_id, car_model, car_color, license_plate, seats, status)
    VALUES ($1, $2, $3, $4, $5, 'active')
    RETURNING *
    `,
    [user_id, car_model, car_color, license_plate, seats]
  );

  return result.rows[0];
};

module.exports = {
  createCar
};
