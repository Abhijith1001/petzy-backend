

const mongoose = require('mongoose');

const wishlistSchema = new mongoose.Schema({
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet', 
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  shelterID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shelter', 
    required: true,
  },
  shelterName: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  petname: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Wishlist', wishlistSchema); 