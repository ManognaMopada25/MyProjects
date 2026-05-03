const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../db');
require('dotenv').config();

const fixHod = async () => {
    try {
        await connectDB();
        console.log("Connected to DB...");

        // List all HODs in IT
        const hods = await User.find({ role: 'HOD', department: 'IT' });
        console.log("Existing IT HODs:", hods.map(h => ({ email: h.email, id: h._id })));

        // We want 'fod_it@college.edu' to exist and have password 'password123'
        const targetEmail = 'fod_it@college.edu';
        let targetHod = await User.findOne({ email: targetEmail });

        if (targetHod) {
            console.log(`Updating existing user ${targetEmail} password...`);
            targetHod.password = 'password123'; // Pre-save hook will hash
            await targetHod.save();
            console.log("Password updated.");
        } else {
            console.log(`Creating user ${targetEmail}...`);
            await User.create({
                name: "IT HOD",
                email: targetEmail,
                password: "password123",
                role: "HOD",
                department: "IT"
            });
            console.log("User created.");
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

fixHod();
