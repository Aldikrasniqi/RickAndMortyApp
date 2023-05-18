const User = require('../models/model'); // Import the User model
const bcrypt = require('bcrypt');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  console.log(token, authHeader);
  if (token == null) return res.sendStatus(401);
};
// has promition to access the route
module.exports = authMiddleware;
