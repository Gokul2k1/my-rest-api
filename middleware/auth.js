const jwt = require('jsonwebtoken');
const { generateKey } = require('../util/token');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ msg: 'Authorization token missing or malformed' });
    }

    const aToken = authHeader.split(' ')[1]; 
    const secret_key = generateKey();
    console.log('Auth Secret Key:', secret_key);

    jwt.verify(aToken, secret_key, (err, response) => {
      if (err) {
        return res.status(400).json({ msg: "Token expired or invalid." });
      }

      req.userId = response.id;
      next();
    });

  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

module.exports = authMiddleware;