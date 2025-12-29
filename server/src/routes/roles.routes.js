const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth.middleware');
const roleController = require('../controllers/role.controller');

router.post('/choose', auth, roleController.chooseRole);

module.exports = router;
