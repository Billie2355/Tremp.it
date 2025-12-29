const userService = require('../services/user.service');

// FIRST CRUD START
const createUser = async (req, res) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.id);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await userService.deleteUser(req.params.id);
    res.json({ message: 'User deactivated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// FIRST CRUD END

const getMe = async (req, res) => {
  try {
    console.log("HIIIIIII: " + req.user.id)
    const userData = await userService.getMe(req.user.id);
    res.json(userData);
  } catch (err) {
    console.error("GET /me error:", err.message);
    res.status(500).json({ message: "Failed to get user data" });
  }
};


module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getMe
};
