const mongoose = require('mongoose');

const carSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: String,
    tags: [String],
    images: [String] // Stores URLs or file paths for images
});

module.exports = mongoose.model('Car', carSchema);
