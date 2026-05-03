const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

const demoUsers = [
    // --- Computer Science (CSE) ---
    {
        name: 'HOD CSE',
        email: 'hod_cse@dashboard.com',
        password: 'password123',
        role: 'HOD',
        department: 'CSE'
    },
    {
        name: 'CSE Student One',
        email: 'student_cse1@dashboard.com',
        password: 'password123',
        role: 'Student',
        department: 'CSE'
    },
    {
        name: 'CSE Student Two',
        email: 'student_cse2@dashboard.com',
        password: 'password123',
        role: 'Student',
        department: 'CSE'
    },

    // --- Electronics (ECE) ---
    {
        name: 'HOD ECE',
        email: 'hod_ece@dashboard.com',
        password: 'password123',
        role: 'HOD',
        department: 'ECE'
    },
    {
        name: 'ECE Student One',
        email: 'student_ece1@dashboard.com',
        password: 'password123',
        role: 'Student',
        department: 'ECE'
    },
    {
        name: 'ECE Student Two',
        email: 'student_ece2@dashboard.com',
        password: 'password123',
        role: 'Student',
        department: 'ECE'
    },

    // --- Electrical (EEE) ---
    {
        name: 'HOD EEE',
        email: 'hod_eee@dashboard.com',
        password: 'password123',
        role: 'HOD',
        department: 'EEE'
    },
    {
        name: 'EEE Student One',
        email: 'student_eee1@dashboard.com',
        password: 'password123',
        role: 'Student',
        department: 'EEE'
    },

    // --- Mechanical (MECH) ---
    {
        name: 'HOD MECH',
        email: 'hod_mech@dashboard.com',
        password: 'password123',
        role: 'HOD',
        department: 'MECH'
    },
    {
        name: 'MECH Student One',
        email: 'student_mech1@dashboard.com',
        password: 'password123',
        role: 'Student',
        department: 'MECH'
    },

    // --- Civil (CIVIL) ---
    {
        name: 'HOD CIVIL',
        email: 'hod_civil@dashboard.com',
        password: 'password123',
        role: 'HOD',
        department: 'CIVIL'
    },
    {
        name: 'CIVIL Student One',
        email: 'student_civil1@dashboard.com',
        password: 'password123',
        role: 'Student',
        department: 'CIVIL'
    },

    // --- Legacy / Default for backwards compatibility ---
    {
        name: 'Demo HOD (Legacy)',
        email: 'hod_demo@dashboard.com',
        password: 'password123',
        role: 'HOD',
        department: 'Computer Science'
    },
    {
        name: 'Alice Johnson',
        email: 'alice@student.com',
        password: 'password123',
        role: 'Student',
        department: 'Computer Science'
    }
];

async function seedUsers() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hod-dashboard');
        console.log('MongoDB connected');

        for (const u of demoUsers) {
            const exists = await User.findOne({ email: u.email });
            if (!exists) {
                await User.create(u);
                console.log(`Created user: ${u.role}`);
            } else {
                console.log(`User already exists: ${u.role}`);
            }
        }

        console.log('Seed initialization complete');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding users:', error);
        process.exit(1);
    }
}

seedUsers();
