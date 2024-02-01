const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  orderId: {
    type: String,
  },
  paymentId: {
    type: String,
  },
  items: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        
      },
      petId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',
        
      },
      price: {
        type: Number,
      },
      productName: {
        type: String,
      },
      quantity: {
        type: Number,
      },
      total: {
        type: Number,
      },
      image: {
        type: String,
      },
      type: {
        type: String, // You can add a 'type' field to distinguish between products and pets
      },

    },
  ],
  totalPrice: {
    type: Number,
  },
});

module.exports = mongoose.model('Order', orderSchema);




// createdAt: { type: Date, default: Date.now },
//   status: { type: String, default: 'Pending' },
//   paymentId: { type: String, required: true },
//   paymentMethod: { type: String, required: true },
//   shippingAddress: { type: String, required: true },
//   trackingNumber: { type: String },
//   customerEmail: { type: String, required: true },
//   customerPhone: { type: String },
//   couponCode: { type: String },
//   discountAmount: { type: Number, default: 0 },
//   taxAmount: { type: Number, default: 0 },
// });

