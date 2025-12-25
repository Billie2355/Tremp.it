const userQueries = require('../db/queries/user.queries');

const createUser = async (data) => {
  return await userQueries.createUser(data);
};

const getAllUsers = async () => {
  return await userQueries.getAllUsers();
};

const getUserById = async (id) => {
  return await userQueries.getUserById(id);
};

const updateUser = async (id, data) => {
  return await userQueries.updateUser(id, data);
};

const deleteUser = async (id) => {
  return await userQueries.deactivateUser(id);
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser
};
