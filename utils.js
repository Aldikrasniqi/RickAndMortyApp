const jwt = require('jsonwebtoken');
const generateLogToken = (user) => {
  return JsonWebTokenError.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

module.exports = generateLogToken;
