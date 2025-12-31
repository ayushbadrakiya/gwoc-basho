const express = require('express');
const router = express.Router();
const Workshop = require('../models/Workshop');
const Registration = require('../models/Registration');
// const { checkConflict, addBookingToCalendar } = require("../services/calendarService"); // You can comment this out if you removed the file

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

    // 2. GET USER'S REGISTRATIONS
    router.get('/my-registrations/:userId', async (req, res) => {
        try {
            const regs = await Registration.find({ userId: req.params.userId });
            res.json(regs); 
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

    // 4. REGISTER
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
                seatsBooked, phone, experience 
            });
            await reg.save();

            workshop.seats -= seatsBooked;
            await workshop.save();

            // Email Logic
            const formattedDate = new Date(workshop.date).toLocaleDateString('en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            });
           

            // Create the Professional HTML Template (NO DATE)
            const html = `
              <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden;">
                
                <div style="background-color: #2c3e50; padding: 30px 20px; text-align: center;">
                  <h2 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 500;">Registration Confirmed</h2>
                </div>

                <div style="padding: 40px 30px;">
                  <p style="color: #333333; font-size: 16px; margin-top: 0;">Dear <strong>${userName}</strong>,</p>
                  
                  <p style="color: #555555; line-height: 1.6; font-size: 16px;">
                    Thank you for registering with us. We are pleased to confirm your reservation for the <strong>${workshop.title}</strong> workshop. Your spot has been officially secured.
                  </p>

                  <div style="background-color: #f8f9fa; border-left: 5px solid #27ae60; padding: 20px; margin: 25px 0;">
                    <h3 style="color: #2c3e50; margin-top: 0; font-size: 18px;">Workshop Details</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                      <tr>
                        <td style="padding: 5px 0; color: #555555; width: 30%;"><strong>Topic:</strong></td>
                        <td style="padding: 5px 0; color: #333333;">${workshop.title}</td>
                      </tr>
                      <tr>
                        <td style="padding: 5px 0; color: #555555;"><strong>Reference ID:</strong></td>
                        <td style="padding: 5px 0; color: #333333;">#${reg._id}</td>
                      </tr>
                    </table>
                  </div>

                  <p style="color: #555555; line-height: 1.6; font-size: 15px;">
                    Please arrive 10-15 minutes prior to the start time to get settled. All materials will be provided at the studio.
                  </p>

                  <p style="color: #333333; font-weight: bold; margin-top: 30px;">We look forward to seeing you!</p>
                  <p style="color: #777777; font-size: 14px; margin-top: 5px;">— Basho Byy Shivangi</p>
                </div>

                <div style="background-color: #f4f4f4; padding: 20px; text-align: center; font-size: 12px; color: #999999; border-top: 1px solid #e0e0e0;">
                   &copy;  The Pottery Shop. All rights reserved.<br/>
                   123 Creative Avenue, Arts District
                </div>
              </div>
            `;

            sendEmail(reg.userEmail, "Workshop Confirmation", html);

            res.json({ success: true, msg: "Registered Successfully!" });

        } catch (err) { res.status(500).json({ msg: err.message }); }
    });

    // 5. CANCEL REGISTRATION
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
            
            // Note: I fixed the "user" variable error here (changed user.username to reg.userName)
            // matching the fix we discussed, so this code actually runs.
            const html = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px;">
                <div style="background-color: #2c3e50; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
                  <h2 style="color: #ffffff; margin: 0;">Registration Cancelled</h2>
                </div>
                <div style="padding: 30px;">
                  <p style="color: #333; font-size: 16px;">Dear <strong>${reg.userName}</strong>,</p>
                  <p style="color: #555; line-height: 1.6;">
                    We have processed your cancellation for <strong>${reg.workshopTitle}</strong>.
                  </p>
                  <p style="color: #333; font-weight: bold; margin-top: 30px;">Hope to see you next time!</p>
                </div>
              </div>
            `;

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