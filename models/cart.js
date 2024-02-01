const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product', // Reference to the 'Product' model
  },
  petId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Pet', // Reference to the 'Pet' model
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  productname: {
    type: String,
  },
  petname: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  type: {
    type: String, // You can add a 'type' field to distinguish between products and pets
  },
});

module.exports = mongoose.model('Cart', cartSchema);
