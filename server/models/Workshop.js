const mongoose = require('mongoose');

const WorkshopSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, required: true },
  
  // NEW: Category to distinguish One-on-One vs Group
  category: { type: String, enum: ['GROUP', 'ONE-ON-ONE'], default: 'GROUP' },
  
  description: { type: String },
  price: { type: Number, default: 0 },
  image: { type: String },
  seats: { type: Number, default: 20 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Workshop', WorkshopSchema);