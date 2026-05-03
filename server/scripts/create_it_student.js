const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../db');
require('dotenv').config();

const createItStudent = async () => {
    try {
        await connectDB();
        console.log("Connected to DB...");

        const email = "student_it@college.edu";
        let user = await User.findOne({ email });

        if (!user) {
            await User.create({
                name: "IT Student 1",
                email: email,
                password: "password123",
                role: "Student",
                department: "IT",
                year: "1"
            });
            console.log(`Created IT Student: ${email}`);
        } else {
            console.log(`IT Student exists: ${email}`);
        }

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

createItStudent();
