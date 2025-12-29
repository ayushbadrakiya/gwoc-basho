const express = require('express');
const router = express.Router();
const Workshop = require('../models/Workshop');
const Registration = require('../models/Registration');

module.exports = (upload, sendEmail) => {
    
    // 1. GET ALL WORKSHOPS (Visible & Future Only)
    router.get('/', async (req, res) => {
        try {
            const workshops = await Workshop.find({ 
                date: { $gte: new Date() } 
            }).sort({ date: 1 }); 
            res.json(workshops);
        } catch (err) { res.status(500).json({ msg: err.message }); }
    });

    router.delete('/:id', async (req, res) => {
        try {
            await Workshop.findByIdAndDelete(req.params.id);
            // Optional: Delete associated registrations if you want
            // await Registration.deleteMany({ workshopId: req.params.id }); 
            res.json({ success: true, msg: "Workshop Deleted" });
        } catch (err) { res.status(500).json({ msg: err.message }); }
    });

    // 2. GET USER'S REGISTRATIONS (New Endpoint)
    // We need this so the frontend knows which buttons to show (Register vs Cancel)
    router.get('/my-registrations/:userId', async (req, res) => {
        try {
            const regs = await Registration.find({ userId: req.params.userId });
            res.json(regs); // Returns list of bookings for this user
        } catch (err) { res.status(500).json({ msg: err.message }); }
    });

    // 3. CREATE WORKSHOP (Admin)
    router.post('/add', upload.single('image'), async (req, res) => {
        try {
            const { title, date, description, seats, category, isAdmin } = req.body;
            if (!isAdmin) return res.status(403).json({ msg: "Admin only" });

            const newWorkshop = new Workshop({
                title, date, description, seats, category,
                image: req.file ? req.file.filename : ''
            });
            await newWorkshop.save();
            res.json({ success: true, msg: "Workshop Created!" });
        } catch (err) { res.status(500).json({ msg: err.message }); }
    });

    // 4. REGISTER (Updated: Duplicate Check)
    router.post('/register', async (req, res) => {
        try {
            const { userId, userName, userEmail, workshopId, seatsBooked, phone, experience } = req.body;

            // --- CHECK 1: ALREADY REGISTERED? ---
            const existingReg = await Registration.findOne({ userId, workshopId });
            if (existingReg) {
                return res.status(400).json({ msg: "You have already registered for this workshop." });
            }

            const workshop = await Workshop.findById(workshopId);
            if (!workshop) return res.status(404).json({ msg: "Workshop not found" });

            if (workshop.seats < seatsBooked) {
                return res.status(400).json({ msg: "Not enough seats available" });
            }

            const reg = new Registration({
                workshopId, workshopTitle: workshop.title,
                userId, userName, userEmail,
                seatsBooked, phone, experience // Saving extra details
            });
            await reg.save();

            workshop.seats -= seatsBooked;
            await workshop.save();

            // Email Logic (Simplified)
            sendEmail(userEmail, "Workshop Confirmed", `See you at ${workshop.title}!`);

            res.json({ success: true, msg: "Registered Successfully!" });

        } catch (err) { res.status(500).json({ msg: err.message }); }
    });

    // 5. CANCEL REGISTRATION (New Route)
    router.post('/cancel', async (req, res) => {
        try {
            const { userId, workshopId } = req.body;

            // 1. Find the registration details first (so we have email info)
            const reg = await Registration.findOne({ userId, workshopId });
            if (!reg) return res.status(404).json({ msg: "Registration not found" });

            // 2. Delete the registration
            await Registration.findByIdAndDelete(reg._id);

            // 3. Restore seats to the workshop
            const workshop = await Workshop.findById(workshopId);
            if (workshop) {
                workshop.seats += reg.seatsBooked;
                await workshop.save();
            }

            // 4. SEND CANCELLATION EMAIL
            const subject = `Cancelled: ${reg.workshopTitle}`;
            const html = `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h2 style="color: #c85428;">Registration Cancelled</h2>
                    <p>Hi <strong>${reg.userName}</strong>,</p>
                    <p>Your registration for the workshop <strong>${reg.workshopTitle}</strong> has been successfully cancelled.</p>
                    <p>If this was a mistake, please re-book via the website.</p>
                    <br/>
                    <p>Best Regards,<br/>Basho by Shivangi</p>
                </div>
            `;
            
            // Send the email
            sendEmail(reg.userEmail, subject, html);

            res.json({ success: true, msg: "Registration Cancelled & Email Sent" });

        } catch (err) { res.status(500).json({ msg: err.message }); }
    });

    // 6. ADMIN GET ALL REGISTRATIONS
    router.get('/registrations', async (req, res) => {
        try {
            const registrations = await Registration.find().sort({ bookedAt: -1 });
            res.json(registrations);
        } catch (err) { res.status(500).json({ msg: err.message }); }
    });

    return router;
};