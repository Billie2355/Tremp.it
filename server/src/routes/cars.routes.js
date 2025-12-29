const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const carController = require('../controllers/car.controller');

router.post('/', auth, carController.createCar);

module.exports = router;
