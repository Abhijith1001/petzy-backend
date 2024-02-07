const mongoose = require('mongoose')

const RequestSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, ref: 'User' },
    workHours: [{ type: String }],
    services: [{ type: String }],})

const RequestSitter = mongoose.model('RequestSitter', RequestSchema)

module.exports = RequestSitter;
