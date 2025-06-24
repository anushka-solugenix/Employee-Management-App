const jwt = require('jsonwebtoken');
const Employee = require('../models/employee');
const SECRET_KEY = process.env.ACCESS_TOKEN;

async function verifyToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY);

    const user = await Employee.findOne({
      _id: decoded.userId,
      access_token: token
    });

    if (!user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token verification failed' });
  }
}

module.exports = verifyToken;

