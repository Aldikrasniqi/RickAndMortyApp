const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  token: String,
});

// const favoriteSchema = new mongoose.Schema({
//   character_name: String,
// });

// const Favorite = mongoose.model('Favorite', favoriteSchema);
const User = mongoose.model('User', userSchema);

module.exports = User;
// module.exports = Favorite;
