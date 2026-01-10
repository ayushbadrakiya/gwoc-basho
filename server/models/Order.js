const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  // ... existing fields ...
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String },
  address: { type: String },
  city: { type: String },
  zip: { type: String },
  amount: { type: Number, default: 0 },
  status: { type: String, default: 'CONFIRMED' },
  trackingStatus: { type: String, default: 'Processing' },
  orderType: { type: String, required: true },

  // Standard Order Fields
  productId: String,
  productName: String,
  productImage: String,

  // Custom Order Fields
  customDetails: {
        description: String,
        material: String
    },
  description: { type: String, default: '' }, // <--- VITAL
  material: { type: String, default: '' },
  // --- NEW: Array to store custom image filenames ---
  customImages: [{ type: String }], 

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', OrderSchema);