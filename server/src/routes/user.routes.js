const express = require('express');
const router = express.Router();
const auth = require("../middleware/auth.middleware");
const userController = require('../controllers/user.controller');

router.get("/me", auth, userController.getMe);

// FIRST CRUD START
router.post('/', userController.createUser);
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
// FIRST CRUD END

module.exports = router;
