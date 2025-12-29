const roleQueries = require('../db/queries/role.queries');
const userQueries = require('../db/queries/user.queries');

const chooseRole = async (userId, roleName) => {
  if (!roleName) {
    throw new Error('Role is required');
  }

  if (!['driver', 'passenger'].includes(roleName)) {
    throw new Error('Invalid role');
  }

  // האם כבר יש role?
  const existingRole = await userQueries.getUserRole(userId);
  if (existingRole) {
    throw new Error('Role already assigned');
  }

  // מציאת role_id
  const role = await roleQueries.getRoleByName(roleName);
  if (!role) {
    throw new Error('Role not found');
  }

  // שמירה בטבלת user_roles
  await roleQueries.assignRoleToUser(userId, role.id);

  return {
    message: 'Role assigned successfully',
    role: roleName
  };
};

module.exports = { chooseRole };
