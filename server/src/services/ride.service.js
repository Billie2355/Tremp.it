const rideQueries = require('../db/queries/ride.queries');
const userQueries = require('../db/queries/user.queries');
const carService = require('../db/queries/car.queries');

const createRide = async (userId, data) => {
  const {
    car_id,
    origin,
    destination,
    departure_time,
    seats_offering,
    price
  } = data;

  // בדיקות בסיס
  if (
    !car_id ||
    !origin ||
    !destination ||
    !departure_time ||
    !seats_offering
  ) {
    throw new Error('Missing required fields');
  }

  if (seats_offering <= 0) {
    throw new Error('Seats offering must be greater than 0');
  }

  if (price !== undefined && price < 0) {
    throw new Error('Price must be positive');
  }

  // בדיקה: המשתמש הוא driver
  const roleRes = await userQueries.getUserRole(userId);
  if (!roleRes || roleRes.name !== 'driver') {
    throw new Error('Only drivers can create rides');
  }

  // בדיקה: הרכב שייך למשתמש
  const carsCount = await userQueries.getActiveCarsCount(userId);
  console.log("carsCount: ", carsCount)
  if (carsCount.count < 1) {
    throw new Error('Driver has no active cars');
  }
  const car = await carService.getCarById(car_id)
  if (car.user_id != userId) {
    throw new Error('Invalid Car')
  }


  // יצירת נסיעה (MVP – לא recurring)
  const ride = await rideQueries.createRide({
    driver_id: userId,
    car_id,
    origin,
    destination,
    departure_time,
    seats_offering,
    price
  });

  return {
    message: 'Ride created successfully',
    ride
  };
};

const searchRides = async (filters) => {
  const {
    origin,
    destination,
    time_from,
    time_to
  } = filters;

  if (!origin || !destination) {
    throw new Error('Origin and destination are required');
  }

  return await rideQueries.searchRides({
    origin,
    destination,
    time_from,
    time_to
  });
};

module.exports = { createRide, searchRides };
 