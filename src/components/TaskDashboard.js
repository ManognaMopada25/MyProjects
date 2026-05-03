'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';

export default function TaskDashboard() {
    const [tasks, setTasks] = useState([]);
    const [users, setUsers] = useState([]); // Faculty & Students
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assignedTo: '',
        department: '',
        priority: 'Medium',
        dueDate: '',
    });
    const [file, setFile] = useState(null);

    // New State for Student Management
    const [activeTab, setActiveTab] = useState('tasks'); // 'tasks' or 'students'
    const [studentTab, setStudentTab] = useState('All'); // 'All', '1', '2', '3', '4'
    const [studentForm, setStudentForm] = useState({ name: '', email: '', year: '1' });
    const [editingStudent, setEditingStudent] = useState(null);
    const [csvFile, setCsvFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        // Load user from local storage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setCurrentUser(parsedUser);
            setFormData(prev => ({ ...prev, department: parsedUser.department }));
            fetchTasks(parsedUser);
        } else {
            setLoading(false);
        }

        fetchUsers();
    }, []);

    const fetchTasks = async (user) => {
        // Use the passed user object or fall back to currentUser state (but passed is safer for initial load)
        const targetUser = user || currentUser;
        if (!targetUser) return;

        try {
            // Filter by createdBy to show only tasks created by this HOD
            const userId = targetUser.id || targetUser._id || targetUser.email;
            if (!userId) {
                console.error("No valid user ID found for fetching tasks.");
                return;
            }

            console.log("Fetching tasks for User ID:", userId);

            // Add a timestamp to prevent caching
            const res = await fetch(`http://localhost:5000/api/tasks/all?_t=${Date.now()}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });

            if (!res.ok) throw new Error('Failed to fetch tasks');

            const data = await res.json();
            // Double check if the backend returned what we asked for (extra safety)
            setTasks(data);
        } catch (err) {
            console.error(err);
            setError("Failed to load your tasks.");
        } finally {
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const res = await fetch('http://localhost:5000/api/users', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error('Failed to fetch users');
            const data = await res.json();
            setUsers(data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!currentUser) return;

        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('assignedTo', formData.assignedTo);
        data.append('department', formData.department);
        data.append('priority', formData.priority);
        data.append('dueDate', formData.dueDate);
        // data.append('createdBy', currentUser.id || currentUser.email); // Handled by token now
        if (file) {
            data.append('document', file);
        }

        try {
            const res = await fetch('http://localhost:5000/api/tasks/create', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: data,
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || 'Failed to create task');
            }

            // Reset form
            setFormData({
                title: '',
                description: '',
                assignedTo: '',
                department: currentUser.department,
                priority: 'Medium',
                dueDate: '',
            });
            setFile(null);
            fetchTasks(currentUser); // Refresh list
        } catch (err) {
            setError(err.message);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this task?')) return;
        try {
            const res = await fetch(`http://localhost:5000/api/tasks/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!res.ok) throw new Error('Failed to delete task');
            fetchTasks(currentUser);
        } catch (err) {
            console.error('Delete error:', err);
            alert('Error deleting task: ' + err.message);
        }
    };

    const updateTaskStatus = async (taskId, newStatus) => {
        try {
            const res = await fetch(`http://localhost:5000/api/tasks/update/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ status: newStatus })
            });
            if (!res.ok) throw new Error('Failed to update status');
            fetchTasks(currentUser);
        } catch (err) {
            alert(err.message);
        }
    };

    // Student Management Handlers
    const handleStudentFormChange = (e) => {
        setStudentForm({ ...studentForm, [e.target.name]: e.target.value });
    };

    const handleStudentSubmit = async (e) => {
        e.preventDefault();

        if (editingStudent) {
            // Update Existing Student
            try {
                const res = await fetch(`http://localhost:5000/api/users/${editingStudent._id}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(studentForm)
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Failed to update student');

                alert('Student updated successfully!');
                setEditingStudent(null);
                setStudentForm({ name: '', email: '', year: '1' });
                fetchUsers();
            } catch (err) {
                alert(err.message);
            }
        } else {
            // Add New Student
            try {
                const res = await fetch('http://localhost:5000/api/users/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(studentForm)
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Failed to add student');

                alert('Student added successfully!');
                setStudentForm({ name: '', email: '', year: '1' });
                fetchUsers();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const handleEditStudent = (student) => {
        setEditingStudent(student);
        setStudentForm({
            name: student.name,
            email: student.email,
            year: student.year || '1'
        });
    };

    const handleCancelEdit = () => {
        setEditingStudent(null);
        setStudentForm({ name: '', email: '', year: '1' });
    };

    const handleCsvUpload = async (e) => {
        e.preventDefault();
        if (!csvFile) return alert('Please select a file');

        const formData = new FormData();
        formData.append('file', csvFile);

        setUploading(true);
        try {
            const res = await fetch('http://localhost:5000/api/users/upload-csv', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to upload CSV');

            alert(data.message + (data.errors.length > 0 ? `\nErrors:\n${data.errors.join('\n')}` : ''));
            setCsvFile(null);
            // Reset file input manually if needed or just rely on state
            fetchUsers();
        } catch (err) {
            alert(err.message);
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteStudent = async (id) => {
        if (!window.confirm('Are you sure you want to delete this student?')) return;
        try {
            const res = await fetch(`http://localhost:5000/api/users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (!res.ok) throw new Error('Failed to delete student');
            fetchUsers();
        } catch (err) {
            alert(err.message);
        }
    };

    // Filter Students
    const getFilteredStudents = () => {
        let students = users.filter(u => u.role === 'Student');
        if (studentTab !== 'All') {
            students = students.filter(u => u.year === studentTab);
        }
        return students;
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1>Task Repository</h1>
                <div style={styles.userInfo}>
                    {currentUser && (
                        <>
                            <span>{currentUser.name} ({currentUser.role})</span>
                            <span style={{ fontSize: '10px', color: '#ccc' }}>ID: {currentUser.id || currentUser._id}</span>
                            <button onClick={() => window.location.href = '/profile'} style={styles.profileBtn}>Edit Profile</button>
                            <button onClick={() => {
                                localStorage.removeItem('token');
                                localStorage.removeItem('user');
                                window.location.href = '/login';
                            }} style={styles.logoutBtn}>Logout</button>
                        </>
                    )}
                </div>
            </header>

            <main style={styles.main}>
                <div style={styles.tabContainer}>
                    <button style={activeTab === 'tasks' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('tasks')}>Tasks & Overview</button>
                    <button style={activeTab === 'students' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('students')}>Student Management</button>
                </div>

                {activeTab === 'tasks' ? (
                    <>
                        {/* TASK STATISTICS SECTION */}
                        <section style={styles.section}>
                            <h2>Task Statistics</h2>
                            <div style={styles.chartsContainer}>
                                <div style={styles.chartWrapper}>
                                    <h3>Tasks by Status</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { name: 'Pending', value: tasks.filter(t => t.status === 'Pending').length },
                                                    { name: 'In Progress', value: tasks.filter(t => t.status === 'In Progress').length },
                                                    { name: 'Completed', value: tasks.filter(t => t.status === 'Completed').length },
                                                    { name: 'On Hold', value: tasks.filter(t => t.status === 'On Hold').length },
                                                ].filter(i => i.value > 0)}
                                                cx="50%"
                                                cy="50%"
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                                label
                                            >
                                                {tasks.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={['#FFBB28', '#00C49F', '#0088FE', '#FF8042'][index % 4]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                                <div style={styles.chartWrapper}>
                                    <h3>Tasks by Priority</h3>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart
                                            data={[
                                                { name: 'Low', count: tasks.filter(t => t.priority === 'Low').length },
                                                { name: 'Medium', count: tasks.filter(t => t.priority === 'Medium').length },
                                                { name: 'High', count: tasks.filter(t => t.priority === 'High').length },
                                                { name: 'Critical', count: tasks.filter(t => t.priority === 'Critical').length },
                                            ]}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" />
                                            <XAxis dataKey="name" />
                                            <YAxis allowDecimals={false} />
                                            <Tooltip />
                                            <Bar dataKey="count" fill="#82ca9d" />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </section>

                        {/* CREATE TASK SECTION */}
                        <section style={styles.section}>
                            <h2>Create Assignment / Task</h2>
                            {error && <div style={styles.error}>{error}</div>}
                            <form onSubmit={handleSubmit} style={styles.form}>
                                <div style={styles.formRow}>
                                    <div style={styles.formGroup}>
                                        <label>Title</label>
                                        <input required type="text" name="title" value={formData.title} onChange={handleInputChange} style={styles.input} />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label>Department</label>
                                        <input disabled type="text" value={formData.department} style={{ ...styles.input, backgroundColor: '#eee' }} />
                                    </div>
                                </div>

                                <div style={styles.formRow}>
                                    <div style={styles.formGroup}>
                                        <label>Assign To (Student/Faculty)</label>
                                        <select
                                            name="assignedTo"
                                            value={formData.assignedTo}
                                            onChange={handleInputChange}
                                            style={styles.input}
                                            required
                                        >
                                            <option value="">Select Student</option>
                                            {users.filter(u => u.role === 'Student').map(user => (
                                                <option key={user._id} value={user._id}>{user.name} ({user.email}) - {user.year ? `${user.year} Year` : 'N/A'}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label>Priority</label>
                                        <select name="priority" value={formData.priority} onChange={handleInputChange} style={styles.input}>
                                            <option>Low</option>
                                            <option>Medium</option>
                                            <option>High</option>
                                            <option>Critical</option>
                                        </select>
                                    </div>
                                </div>

                                <div style={styles.formGroup}>
                                    <label>Description</label>
                                    <textarea name="description" value={formData.description} onChange={handleInputChange} style={{ ...styles.input, height: '80px' }} />
                                </div>

                                <div style={styles.formRow}>
                                    <div style={styles.formGroup}>
                                        <label>Due Date</label>
                                        <input type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} style={styles.input} />
                                    </div>
                                    <div style={styles.formGroup}>
                                        <label>Attach Document</label>
                                        <input type="file" onChange={handleFileChange} style={styles.input} />
                                    </div>
                                </div>

                                <button type="submit" style={styles.submitBtn}>Assign Task</button>
                            </form>
                        </section>

                        {/* ALL TASKS SECTION */}
                        <section style={styles.section}>
                            <h2>All Tasks</h2>
                            {loading ? <p>Loading tasks...</p> : (
                                <div style={styles.taskList}>
                                    {tasks.length === 0 && <p>No tasks found.</p>}
                                    {tasks.map(task => (
                                        <div key={task._id} style={styles.taskCard}>
                                            <div style={styles.cardHeader}>
                                                <h3>{task.title}</h3>
                                                <span style={{ ...styles.badge, backgroundColor: getPriorityColor(task.priority) }}>{task.priority}</span>
                                            </div>
                                            <p style={styles.taskDesc}>{task.description}</p>
                                            <div style={styles.metaData}>
                                                <p><strong>Assigned To:</strong> {task.assignedTo}</p>
                                                <p><strong>Status:</strong> {task.status}</p>
                                                <p><strong>Due:</strong> {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</p>
                                            </div>
                                            <div style={styles.cardActions}>
                                                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                                                    {task.documentUrl && (
                                                        <a href={`http://localhost:5000${task.documentUrl}`} target="_blank" rel="noopener noreferrer" style={styles.linkBtn}>
                                                            📄 Assignment
                                                        </a>
                                                    )}
                                                    {task.submissionUrl && (
                                                        <a href={`http://localhost:5000${task.submissionUrl}`} target="_blank" rel="noopener noreferrer" style={{ ...styles.linkBtn, color: 'green' }}>
                                                            ✅ Submission
                                                        </a>
                                                    )}
                                                </div>
                                                <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                                                    {task.status === 'Submitted' && (
                                                        <div style={{ display: 'flex', gap: '5px' }}>
                                                            <button onClick={() => updateTaskStatus(task._id, 'Completed')} style={styles.approveBtn}>✅ Approve</button>
                                                            <button onClick={() => updateTaskStatus(task._id, 'In Progress')} style={styles.rejectBtn}>↩ Request Changes</button>
                                                        </div>
                                                    )}
                                                </div>
                                                <button onClick={() => handleDelete(task._id)} style={styles.deleteBtn}>Delete</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </>
                ) : (
                    <>
                        <section style={styles.section}>
                            <h2>Add Student</h2>
                            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
                                {/* MANUAL ADD */}
                                <div style={{ flex: 1, minWidth: '300px' }}>
                                    <h3>{editingStudent ? 'Edit Student' : 'Manual Entry'}</h3>
                                    <form onSubmit={handleStudentSubmit} style={styles.form}>
                                        <div style={styles.formGroup}>
                                            <label>Name</label>
                                            <input required type="text" name="name" value={studentForm.name} onChange={handleStudentFormChange} style={styles.input} placeholder="John Doe" />
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label>Email</label>
                                            <input required type="email" name="email" value={studentForm.email} onChange={handleStudentFormChange} style={styles.input} placeholder="john@example.com" />
                                        </div>
                                        <div style={styles.formGroup}>
                                            <label>Year</label>
                                            <select name="year" value={studentForm.year} onChange={handleStudentFormChange} style={styles.input}>
                                                <option value="1">1st Year</option>
                                                <option value="2">2nd Year</option>
                                                <option value="3">3rd Year</option>
                                                <option value="4">4th Year</option>
                                            </select>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <button type="submit" style={styles.submitBtn}>{editingStudent ? 'Update Student' : 'Add Student'}</button>
                                            {editingStudent && (
                                                <button type="button" onClick={handleCancelEdit} style={{ ...styles.submitBtn, backgroundColor: '#6c757d' }}>Cancel</button>
                                            )}
                                        </div>
                                    </form>
                                </div>

                                {/* CSV UPLOAD */}
                                <div style={{ flex: 1, minWidth: '300px', borderLeft: '1px solid #eee', paddingLeft: '2rem' }}>
                                    <h3>Bulk Upload (CSV)</h3>
                                    <p style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>
                                        Upload a CSV file with headers: <code>name, email, year</code>.
                                        <br />
                                        Example:
                                        <pre style={{ background: '#f8f9fa', padding: '10px', marginTop: '5px' }}>
                                            name,email,year<br />
                                            Alice,alice@college.edu,1
                                        </pre>
                                    </p>
                                    <form onSubmit={handleCsvUpload} style={styles.form}>
                                        <input type="file" accept=".csv" onChange={(e) => setCsvFile(e.target.files[0])} style={styles.input} />
                                        <button type="submit" disabled={uploading} style={{ ...styles.submitBtn, backgroundColor: uploading ? '#ccc' : '#2563eb' }}>
                                            {uploading ? 'Uploading...' : 'Upload CSV'}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </section>

                        <section style={styles.section}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <h2>Student List</h2>
                                <div style={styles.tabContainer}>
                                    {['All', '1', '2', '3', '4'].map(y => (
                                        <button
                                            key={y}
                                            onClick={() => setStudentTab(y)}
                                            style={studentTab === y ? styles.activeStatusTab : styles.statusTab}
                                        >
                                            {y === 'All' ? 'All Years' : `${y} Year`}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
                                <thead>
                                    <tr style={{ backgroundColor: '#f8f9fa', textAlign: 'left' }}>
                                        <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Name</th>
                                        <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Email</th>
                                        <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Year</th>
                                        <th style={{ padding: '12px', borderBottom: '2px solid #dee2e6' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {getFilteredStudents().length > 0 ? (
                                        getFilteredStudents().map(student => (
                                            <tr key={student._id} style={{ borderBottom: '1px solid #dee2e6' }}>
                                                <td style={{ padding: '12px' }}>{student.name}</td>
                                                <td style={{ padding: '12px', fontFamily: 'monospace' }}>{student.email}</td>
                                                <td style={{ padding: '12px' }}>{student.year ? `${student.year} Year` : 'N/A'}</td>
                                                <td style={{ padding: '12px' }}>
                                                    <button onClick={() => handleEditStudent(student)} style={{ ...styles.deleteBtn, backgroundColor: '#3b82f6', color: 'white', marginRight: '5px' }}>Edit</button>
                                                    <button onClick={() => handleDeleteStudent(student._id)} style={styles.deleteBtn}>Delete</button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>No students found.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </section>
                    </>
                )}

            </main>
        </div >
    );
}

const getPriorityColor = (p) => {
    switch (p) {
        case 'High': return '#ffadad';
        case 'Critical': return '#ff6b6b';
        case 'Medium': return '#ffd6a5';
        case 'Low': return '#caffbf';
        default: return '#eee';
    }
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#f3f4f6',
        fontFamily: 'sans-serif',
    },
    header: {
        backgroundColor: '#1f2937',
        color: 'white',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userInfo: {
        display: 'flex',
        gap: '1rem',
        alignItems: 'center',
    },
    profileBtn: {
        backgroundColor: '#4b5563',
        color: 'white',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    logoutBtn: {
        backgroundColor: '#dc2626',
        color: 'white',
        border: 'none',
        padding: '0.5rem 1rem',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    main: {
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
    },
    section: {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        marginBottom: '2rem',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    formRow: {
        display: 'flex',
        gap: '1rem',
        flexWrap: 'wrap',
    },
    formGroup: {
        flex: 1,
        minWidth: '250px',
    },
    input: {
        width: '100%',
        padding: '0.5rem',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        marginTop: '0.25rem',
    },
    submitBtn: {
        backgroundColor: '#10b981',
        color: 'white',
        border: 'none',
        padding: '0.75rem',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
        fontWeight: 'bold',
        width: 'fit-content',
    },
    taskList: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '1.5rem',
    },
    taskCard: {
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '1.5rem',
        backgroundColor: 'white',
    },
    cardHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'start',
        marginBottom: '1rem',
    },
    badge: {
        padding: '0.25rem 0.5rem',
        borderRadius: '9999px',
        fontSize: '0.75rem',
        fontWeight: 'bold',
    },
    taskDesc: {
        color: '#4b5563',
        marginBottom: '1rem',
    },
    metaData: {
        fontSize: '0.875rem',
        color: '#374151',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.25rem',
        marginBottom: '1rem',
    },
    cardActions: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 'auto',
    },
    linkBtn: {
        textDecoration: 'none',
        color: '#2563eb',
        fontWeight: '500',
    },
    deleteBtn: {
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        border: 'none',
        padding: '0.25rem 0.75rem',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    error: {
        color: 'red',
        marginBottom: '10px',
    },
    chartsContainer: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '20px',
        justifyContent: 'space-between',
    },
    chartWrapper: {
        flex: '1 1 45%',
        minWidth: '300px',
        height: '350px',
        border: '1px solid #eee',
        padding: '10px',
        borderRadius: '8px',
    },
    approveBtn: {
        backgroundColor: '#10b981',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: 'bold'
    },
    rejectBtn: {
        backgroundColor: '#f59e0b',
        color: 'white',
        border: 'none',
        padding: '5px 10px',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '12px',
        fontWeight: 'bold'
    },
    tabContainer: {
        marginBottom: '20px',
        display: 'flex',
        gap: '10px'
    },
    tab: {
        padding: '10px 20px',
        backgroundColor: '#e5e7eb',
        border: 'none',
        borderRadius: '20px',
        cursor: 'pointer',
        fontWeight: 'bold',
        color: '#374151'
    },
    activeTab: {
        padding: '10px 20px',
        backgroundColor: '#3b82f6',
        color: 'white',
        border: 'none',
        borderRadius: '20px',
        cursor: 'pointer',
        fontWeight: 'bold'
    },
    statusTab: {
        padding: '5px 15px',
        backgroundColor: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '15px',
        cursor: 'pointer',
        color: '#6b7280',
        fontSize: '0.9rem'
    },
    activeStatusTab: {
        padding: '5px 15px',
        backgroundColor: '#eff6ff',
        border: '1px solid #3b82f6',
        borderRadius: '15px',
        cursor: 'pointer',
        color: '#3b82f6',
        fontWeight: 'bold',
        fontSize: '0.9rem'
    }
};

