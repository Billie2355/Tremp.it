const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const rideController = require('../controllers/ride.controller');

router.post('/', auth, rideController.createRide);
router.get('/my', auth, rideController.getMyRides);
router.get('/search', auth, rideController.searchRides);


module.exports = router;

