const mongoose = require('mongoose');

const RegistrationSchema = new mongoose.Schema({
    workshopId: { type: mongoose.Schema.Types.ObjectId, ref: 'Workshop' },
    workshopTitle: String, // Storing title for easy access
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    userEmail: String,
    seatsBooked: { type: Number, default: 1 },
    
    // --- NEW FIELDS ---
    phone: { type: String }, 
    experience: { type: String }, 
    // ------------------

    bookedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Registration', RegistrationSchema);