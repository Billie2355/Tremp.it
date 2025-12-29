const carQueries = require('../db/queries/car.queries');
const userQueries = require('../db/queries/user.queries');

const createCar = async (userId, data) => {
  const { car_model, car_color, license_plate, seats } = data;

  if (!car_model || !license_plate || !seats) {
    throw new Error('Missing required fields');
  }

  if (seats <= 0) {
    throw new Error('Seats must be greater than 0');
  }

  // בדיקה: המשתמש הוא driver?
  const roleRes = await userQueries.getUserRole(userId);
  if (!roleRes || roleRes.name !== 'driver') {
    throw new Error('Only drivers can create cars');
  }

  // יצירת רכב
  const car = await carQueries.createCar({
    user_id: userId,
    car_model,
    car_color,
    license_plate,
    seats
  });

  return {
    message: 'Car created successfully',
    car
  };
};

module.exports = { createCar };
