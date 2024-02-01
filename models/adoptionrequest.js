const mongoose = require('mongoose');

const adoptionRequestSchema = new mongoose.Schema({
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
  firstName: {
    type: String,
    required: true,
  },
  requestDate: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'Rejected'],
    default: 'Pending',
  },
  petname: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
  },

});

module.exports = mongoose.model('AdoptionRequest', adoptionRequestSchema);
