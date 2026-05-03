const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/auth');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const bcrypt = require('bcryptjs'); // Needed for manual add

// Configure Multer for temporary storage
const upload = multer({ dest: 'uploads/' });

// Apply protection to all routes
router.use(protect);

// Get all users (Filtered by Department strictly)
router.get('/', async (req, res) => {
    try {
        const { role } = req.query;
        let filter = {};

        // Strict isolation: User can only see users from their own department
        // unless there is a specific 'SuperAdmin' role (not defined yet, assuming HOD is top level for dept)
        filter.department = req.user.department;

        if (role) filter.role = role;
        if (req.query.year) filter.year = req.query.year;

        // Do not return password
        const users = await User.find(filter).select('name email role department year');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

// Update User Profile
router.put('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Authorization:
        // 1. User can update their own profile.
        // 2. HOD can update users in their department (?) - User request was "edit hod profile", implies self.
        // Let's restrict to: User matches ID OR (User is HOD AND Target is in same Dept)

        const isSelf = req.user._id.toString() === req.params.id;
        const isHodOfDept = req.user.role === 'HOD' && req.user.department === user.department;

        if (!isSelf && !isHodOfDept) {
            return res.status(403).json({ message: 'Not authorized to update this profile' });
        }

        const { name, email, department, password, year } = req.body;

        if (name) user.name = name;
        if (email) user.email = email;
        if (year) user.year = year;

        // Only allow changing department if needed, but for now strict isolation usually implies fixed departments unless changed by Admin. 
        // We allow it if the user is authorized, but we might want to be careful here. 
        // If HOD changes their own department, they might lose access to their dashboard! 
        // For now, if passed, we update it.
        if (department) user.department = department;

        if (password) user.password = password; // pre('save') middleware will hash this

        await user.save();

        res.json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                department: user.department,
            },
        });
    } catch (error) {
        res.status(500).json({ message: error.message || 'Error updating profile' });
    }
});

// Manual Add Student (HOD Only)
router.post('/add', async (req, res) => {
    try {
        if (req.user.role !== 'HOD') {
            return res.status(403).json({ message: 'Only HOD can add students' });
        }

        const { name, email, year } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create user with default password 'password123'
        user = await User.create({
            name,
            email,
            password: 'password123',
            role: 'Student',
            department: req.user.department, // Strict isolation
            year
        });

        res.status(201).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ message: 'Error adding student', error: error.message });
    }
});

// CSV Upload (HOD Only)
router.post('/upload-csv', upload.single('file'), async (req, res) => {
    if (req.user.role !== 'HOD') {
        return res.status(403).json({ message: 'Only HOD can upload students' });
    }

    if (!req.file) {
        return res.status(400).json({ message: 'Please upload a CSV file' });
    }

    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', async () => {
            // Process results
            // Expected CSV headers: Name, Email, Year (optional, defaults to none users usually provided)
            // Or maybe separate CSVs per year? 
            // Let's assume CSV has "Name", "Email", "Year" columns. Keys might be case sensitive.
            // We should normalize keys.

            let addedCount = 0;
            let errors = [];

            for (const row of results) {
                // Normalize keys (lowercase)
                const normalizedRow = {};
                Object.keys(row).forEach(key => {
                    normalizedRow[key.toLowerCase().trim()] = row[key];
                });

                const name = normalizedRow['name'];
                const email = normalizedRow['email'];
                const year = normalizedRow['year']; // e.g. "1", "2"

                if (name && email) {
                    try {
                        // Check duplicate
                        const exists = await User.findOne({ email });
                        if (!exists) {
                            // Hash is handled by pre-save hook in model, but we need to pass a plain password
                            // Create instance manually to ensure hooks run or use User.create
                            await User.create({
                                name,
                                email,
                                password: 'password123',
                                role: 'Student',
                                department: req.user.department,
                                year: year || null
                            });
                            addedCount++;
                        }
                    } catch (err) {
                        errors.push(`Failed to add ${email}: ${err.message}`);
                    }
                }
            }

            // Cleanup file
            fs.unlinkSync(req.file.path);

            res.json({ success: true, message: `Successfully added ${addedCount} students.`, errors });
        });
});

// Delete User (HOD Only, within Dept)
router.delete('/:id', async (req, res) => {
    try {
        if (req.user.role !== 'HOD') {
            return res.status(403).json({ message: 'Only HOD can delete users' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Strict Check
        if (user.department !== req.user.department) {
            return res.status(403).json({ message: 'Cannot delete user from another department' });
        }

        // Prevent deleting self (HOD) via this route just in case
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'Cannot delete yourself' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: 'User deleted' });

    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
});

module.exports = router;
