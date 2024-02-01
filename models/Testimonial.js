const mongoose = require('mongoose');

const testimonialsSchema = new mongoose.Schema({
    title: String,
    content: String,
    author: String,
});

module.exports = mongoose.model('Testimonials', testimonialsSchema);
