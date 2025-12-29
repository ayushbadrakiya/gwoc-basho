const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String }, // For exhibition photos
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('News', NewsSchema);