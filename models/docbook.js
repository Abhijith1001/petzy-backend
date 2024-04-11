const mongoose = require('mongoose');

const HireDoctorSchema = new mongoose.Schema({
    petsitterId: { type: mongoose.Types.ObjectId, ref: 'Doctor' },
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    date: { type: Date },
    timeSlot: { type: String }, // You can store time as a string
    status: { type: String, default: 'pending' } // Set a default value, e.g., 'pending'
});

const HireDoctor = mongoose.model('HireDoctor', HireDoctorSchema);

module.exports = HireDoctor;
