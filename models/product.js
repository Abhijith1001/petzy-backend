const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  productname: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    
  },
  stock:{
    type: Number,
    required: true,
  }

});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
