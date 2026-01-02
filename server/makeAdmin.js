const mongoose = require('mongoose');
const User = require('./models/User');

// FIX: Changed 'ecommerce' to 'pottery_shop' to match your screenshot
mongoose.connect('mongodb://localhost:27017/pottery_shop')
  .then(() => console.log("✅ Connected to 'pottery_shop' database"))
  .catch(err => console.log("❌ DB Connection Error:", err));

const updateAdmin = async () => {
    // ⚠️ REPLACE THIS with the exact email you used to Sign Up
    const email = ""; 

    try {
        console.log(`Searching for user with email: ${email}...`);
        
        const user = await User.findOneAndUpdate(
            { email: email }, 
            { role: 'admin' }, 
            { new: true }
        );
        
        if (user) {
            console.log("------------------------------------------------");
            console.log("🎉 SUCCESS! User updated successfully.");
            console.log("Name:", user.name);
            console.log("New Role:", user.role);
            console.log("------------------------------------------------");
            console.log("👉 Now Logout and Login again to see the Admin Panel.");
        } else {
            console.log("------------------------------------------------");
            console.log("⚠️ USER NOT FOUND");
            console.log("Please double-check the email address.");
            console.log("------------------------------------------------");
        }
    } catch (err) {
        console.error(err);
    }
    process.exit();
};

updateAdmin();
