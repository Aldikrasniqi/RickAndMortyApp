const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  character_id: String,
  character_name: String,
  status: String,
});

const Favorite = mongoose.model('Favorite', favoriteSchema);

module.exports = Favorite;
