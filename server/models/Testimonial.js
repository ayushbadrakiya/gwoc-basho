const mongoose = require('mongoose');

const TestimonialSchema = new mongoose.Schema({
  name: { type: String, required: true },
  message: { type: String, required: true },
  designation: { type: String, default: 'Customer' },
  
  // NEW FIELDS
  media: { type: String }, // Filename
  mediaType: { type: String, enum: ['image', 'video', 'none'], default: 'none' },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Testimonial', TestimonialSchema);