const mongoose = require('mongoose');
const Task = require('./models/Task');
require('dotenv').config();

const departments = ['IT', 'Finance', 'HR', 'Operations', 'Academic', 'Admin'];
const priorities = ['Low', 'Medium', 'High', 'Critical'];
const statuses = ['Pending', 'In Progress', 'Completed', 'On Hold'];
const faculty = [
  'Dr. Rajesh Kumar', 'Prof. Priya Singh', 'Dr. Amit Patel', 'Prof. Neha Sharma',
  'Dr. Vikram Desai', 'Prof. Anjali Gupta', 'Dr. Rohan Verma', 'Prof. Deepa Nair',
  'Dr. Sanjay Reddy', 'Prof. Meera Iyer', 'Dr. Arjun Bhat', 'Prof. Seema Kapoor',
  'Dr. Harish Singh', 'Prof. Ruchira Dutta', 'Dr. Nikhil Agarwal', 'Prof. Pallavi Menon',
  'Dr. Suresh Pandey', 'Prof. Divya Verma'
];

async function seedTasks() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected');

    // Clear existing tasks
    await Task.deleteMany({});
    console.log('Cleared existing tasks');

    // Generate 100 sample tasks
    const sampleTasks = [];
    for (let i = 1; i <= 100; i++) {
      const task = {
        title: `Task ${i}: ${['Code Review', 'Documentation', 'Meeting', 'Report', 'Planning', 'Deployment', 'Testing', 'Design'][Math.floor(Math.random() * 8)]}`,
        description: `Description for task ${i}. This is a sample task for testing purposes.`,
        assignedTo: faculty[Math.floor(Math.random() * faculty.length)],
        department: departments[Math.floor(Math.random() * departments.length)],
        priority: priorities[Math.floor(Math.random() * priorities.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        dueDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000),
        createdBy: 'Admin',
      };
      sampleTasks.push(task);
    }

    // Insert tasks into database
    await Task.insertMany(sampleTasks);
    console.log('Successfully inserted 100 sample tasks');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding tasks:', error);
    process.exit(1);
  }
}

seedTasks();
