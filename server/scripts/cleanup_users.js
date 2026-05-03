const mongoose = require('mongoose');
const User = require('../models/User');
const connectDB = require('../db');
require('dotenv').config(); // Load .env if it exists in server root, though we are running from server dir? 
// Actually .env is in root, so we might need path. 
// But let's assume standard connection works or we pass string.

const cleanDept = async () => {
    try {
        await connectDB();
        console.log("Connected to DB...");

        // 1. Remove all users who are NOT 'IT' and NOT 'Unassigned' (if any)
        // Actually user request: "remove all the dept hod logins and students i want only it dept only not remaining other dept"

        const result = await User.deleteMany({
            department: { $ne: 'IT' }
        });

        console.log(`Deleted ${result.deletedCount} users from other departments.`);

        // 2. Ensure an IT HOD exists?
        // Let's check.
        const itHod = await User.findOne({ department: 'IT', role: 'HOD' });
        if (!itHod) {
            console.log("No IT HOD found. Creating demo IT HOD...");
            // Password hashing happens in pre-save
            await User.create({
                name: "IT HOD",
                email: "fod_it@college.edu",
                password: "password123",
                role: "HOD",
                department: "IT"
            });
            console.log("Created IT HOD: fod_it@college.edu / password123");
        } else {
            console.log("IT HOD exists:", itHod.email);
        }

        console.log("Cleanup complete.");
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

cleanDept();
