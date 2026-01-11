const models = require('../models');
const User = models.User;

const adminAuth = async (req, res, next) => {
  try {
    const id = req.userId;

    const extUser = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });

    if (!extUser) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (extUser.is_admin !== 'true') {
      return res.status(403).json({
        msg: 'Unauthorized. Admin resource blocked for non-admin',
      });
    }

    next();
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = adminAuth;
