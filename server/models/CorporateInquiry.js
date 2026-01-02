const mongoose = require('mongoose');

const CorporateSchema = new mongoose.Schema({
    companyName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    serviceType: { 
        type: String, 
        enum: ['Gifting', 'Workshop', 'Collaboration', 'Other'],
        required: true 
    },
    message: { type: String },
    status: { type: String, default: 'New' }, // New, Contacted, Closed
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CorporateInquiry', CorporateSchema);