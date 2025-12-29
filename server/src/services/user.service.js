const { use } = require("../app");
const db = require("../db/db");
const userQueries = require('../db/queries/user.queries');

// FIRST CRUD START
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
// FIRST CRUD END

const getMe = async (userId) => {
  // 1️⃣ user
  console.log("UserId in Service: " + userId)
  const userRes = await userQueries.getUserById(userId);
  // if (userRes.rowCount === 0) {
  //   throw new Error("User not found");
  // }

  const user = userRes//.rows[0];
  console.log("UserId from db: " + user.id)

  // 2️⃣ role
  const roleRes = await userQueries.getUserRole(userId);
  const role = roleRes ? roleRes.name : null;

  // 3️⃣ readiness
  let isReady = false;
  let nextStep = null;

  if (!role) {
    nextStep = "CHOOSE_ROLE";
  } else if (role === "passenger") {
    isReady = true;
  } else if (role === "driver") {
    const carsRes = await userQueries.getActiveCarsCount(userId);
    if (carsRes.count > 0) {
      isReady = true;
    } else {
      nextStep = "CREATE_CAR";
    }
  }

  return {
    id: user.id,
    email: user.email,
    first_name: user.first_name,
    last_name: user.last_name,
    role,
    is_ready: isReady,
    ...(nextStep && { next_step: nextStep })
  };
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getMe
};
