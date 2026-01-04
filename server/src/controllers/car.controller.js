const carService = require('../services/car.service');

const getCarById = async (req, res) => {
  try {
    const car = await carService.getCarById(req.params.id);
    res.json(car);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

const createCar = async (req, res) => {
  try {
    const userId = req.user.id;
    const car = await carService.createCar(userId, req.body);
    res.status(201).json(car);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { createCar, getCarById };
