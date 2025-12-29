const carService = require('../services/car.service');

const createCar = async (req, res) => {
  try {
    const userId = req.user.id;
    const car = await carService.createCar(userId, req.body);
    res.status(201).json(car);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { createCar };
