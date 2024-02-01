const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    username: {
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    petId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pet',

    },
    price: {
        type: Number,
    },

});

module.exports = mongoose.model('Donation', donationSchema);






