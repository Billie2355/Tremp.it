const roleService = require('../services/role.service');

const chooseRole = async (req, res) => {
  try {
    const userId = req.user.id;
    const { role } = req.body;

    const result = await roleService.chooseRole(userId, role);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports = { chooseRole };
