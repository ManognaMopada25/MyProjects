const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User'); // Import User for validation
const multer = require('multer');
const path = require('path');
const { protect } = require('../middleware/auth'); // Corrected import

// Configure Multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Create a new task (Protected)
router.post('/create', protect, upload.single('document'), async (req, res) => {
  try {
    const { title, description, assignedTo, priority, status, dueDate } = req.body;

    // Strict Source of Truth: The logged-in user
    const createdBy = req.user._id;
    const department = req.user.department; // Force department from token

    if (!title) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    let finalAssignedTo = assignedTo || "Unassigned";

    // Validate Assignee if provided
    // Validation of assignee removed to prevent name/department mismatch blocking.
    // We trust the HOD knows who they are assigning to by name.
    if (assignedTo && assignedTo !== "Unassigned") {
      // Optional: We could log this, but we won't block the request.
    }

    const documentUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newTask = new Task({
      title,
      description,
      assignedTo: finalAssignedTo,
      department, // Enforced
      priority: priority || 'Medium',
      status: status || 'Pending',
      dueDate,
      createdBy, // Forced from token
      documentUrl,
    });

    await newTask.save();
    res.status(201).json({ message: 'Task created successfully', task: newTask });
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
});

// Get tasks assigned to the logged-in user (Student view)
router.get('/assigned', protect, async (req, res) => {
  try {
    // Match by Name (legacy) or ID
    const tasks = await Task.find({
      $or: [
        { assignedTo: req.user.name },
        { assignedTo: req.user._id.toString() }
      ]
    }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching assigned tasks', error: error.message });
  }
});

// Student update task status (Pick / Submit)
router.put('/student/update/:id', protect, upload.single('document'), async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // specific "assignedTo" check
    if (task.assignedTo !== req.user.name && task.assignedTo !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this task' });
    }

    if (status) task.status = status;
    if (req.file) {
      task.submissionUrl = `/uploads/${req.file.filename}`;
    }
    await task.save();
    res.json({ message: 'Task updated successfully', task });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
});

// Get ALL tasks for the logged-in user (Protected)
router.get('/all', protect, async (req, res) => {
  try {
    const { status, priority, department } = req.query;

    // Strict Isolation: Always filter by the token's user ID
    let filter = { createdBy: req.user._id };

    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (department) filter.department = department;

    const tasks = await Task.find(filter).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
});

// Get task by ID (Protected)
router.get('/:id', protect, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, createdBy: req.user._id.toString() }); // Ensure ownership
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task', error: error.message });
  }
});

// Update task (Protected)
router.put('/update/:id', protect, async (req, res) => {
  try {
    const { title, description, assignedTo, department, priority, status, dueDate } = req.body;

    // Ensure update only happens if user owns the task
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id.toString() },
      { title, description, assignedTo, department, priority, status, dueDate },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }
    res.json({ message: 'Task updated successfully', task });
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
});

// Delete task (Protected)
router.delete('/delete/:id', protect, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id.toString() });
    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
});

// Get task statistics (Protected)
router.get('/stats/overview', protect, async (req, res) => {
  try {
    const query = { createdBy: req.user._id }; // Strict Isolation

    const stats = {
      total: await Task.countDocuments(query),
      pending: await Task.countDocuments({ ...query, status: 'Pending' }),
      inProgress: await Task.countDocuments({ ...query, status: 'In Progress' }),
      completed: await Task.countDocuments({ ...query, status: 'Completed' }),
      onHold: await Task.countDocuments({ ...query, status: 'On Hold' }),
    };
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching statistics', error: error.message });
  }
});

module.exports = router;
