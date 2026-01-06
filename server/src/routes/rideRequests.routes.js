const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const controller = require('../controllers/rideRequest.controller');

router.post('/', auth, controller.createRequest);
router.patch('/:id/approve', auth, controller.approveRequest);
router.patch('/:id/reject', auth, controller.rejectRequest);

module.exports = router;
