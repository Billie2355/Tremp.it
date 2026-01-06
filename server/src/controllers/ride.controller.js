const rideService = require('../services/ride.service');

const createRide = async (req, res) => {
  try {
    const userId = req.user.id;
    const ride = await rideService.createRide(userId, req.body);
    res.status(201).json(ride);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getMyRides = async (req, res) => {
  try {
    const driverId = req.user.id;

    const rides = await rideService.getMyRides(driverId);

    res.json(rides);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const searchRides = async (req, res) => {
  try {
    const rides = await rideService.searchRides(req.query);
    res.json(rides);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { createRide, getMyRides, searchRides };
