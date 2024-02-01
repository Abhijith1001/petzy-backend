const mongoose = require('mongoose');

const wishlistProductSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    image: {
        type: String,
    },
    productname: {
        type: String,
    },
    category: {
        type: String,
    },
});

module.exports = mongoose.model('WishlistProduct', wishlistProductSchema);
