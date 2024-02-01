const mongoose = require('mongoose')

const HireSchema = new mongoose.Schema({
    petsitterId: { type: mongoose.Types.ObjectId, ref: 'Petsitter' },
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    status: { type: String, default: 'pending' } // Set a default value, e.g., 'pending'
})

const HireSitter = mongoose.model('HireSitter', HireSchema)

module.exports = HireSitter;
