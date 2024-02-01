const mongoose = require('mongoose');

const rejectedAdoptionSchema = new mongoose.Schema({
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
  petname: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  rejectionStatement: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('RejectedAdoption', rejectedAdoptionSchema);
