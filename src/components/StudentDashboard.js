'use client';

import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

export default function StudentDashboard() {
    const [tasks, setTasks] = useState([]);
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('New Tasks');
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            fetchAssignedTasks();
        }
    }, []);

    const fetchAssignedTasks = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/tasks/assigned', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                setTasks(data);
            }
        } catch (error) {
            console.error("Error fetching tasks", error);
        } finally {
            setLoading(false);
        }
    };

    const updateTaskStatus = async (taskId, newStatus, submissionFile = null) => {
        try {
            const formData = new FormData();
            formData.append('status', newStatus);
            if (submissionFile) {
                formData.append('document', submissionFile);
            }

            const res = await fetch(`http://localhost:5000/api/tasks/student/update/${taskId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: formData
            });

            if (res.ok) {
                alert(newStatus === 'In Progress' ? "Task Picked!" : "Task Submitted!");
                fetchAssignedTasks();
                setFile(null); // Reset file
            } else {
                alert("Failed to update task");
            }
        } catch (error) {
            console.error(error);
        }
    };

    const renderTaskCard = (task) => (
        <div key={task._id} style={styles.card}>
            <h3 style={styles.cardTitle}>{task.title}</h3>
            <p style={styles.cardDesc}>{task.description}</p>
            <div style={styles.cardMeta}>
                <span>📅 Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                <span>🔥 Priority: <span style={{ color: getPriorityColor(task.priority) }}>{task.priority}</span></span>
            </div>

            {/* View Assignment Document */}
            {task.documentUrl && (
                <div style={{ marginBottom: '10px' }}>
                    <a href={`http://localhost:5000${task.documentUrl}`} target="_blank" rel="noopener noreferrer" style={styles.linkBtn}>
                        📄 View Assignment
                    </a>
                </div>
            )}

            {/* View Submitted Document */}
            {task.submissionUrl && (
                <div style={{ marginBottom: '10px' }}>
                    <a href={`http://localhost:5000${task.submissionUrl}`} target="_blank" rel="noopener noreferrer" style={{ ...styles.linkBtn, color: '#28a745' }}>
                        ✅ View Submission
                    </a>
                </div>
            )}

            {task.status === 'Pending' && (
                <button onClick={() => updateTaskStatus(task._id, 'In Progress')} style={styles.actionBtn}>
                    Pick Task
                </button>
            )}

            {task.status === 'In Progress' && (
                <div style={styles.submissionParams}>
                    <input type="file" onChange={(e) => setFile(e.target.files[0])} style={styles.fileInput} />
                    <button
                        onClick={() => updateTaskStatus(task._id, 'Submitted', file)}
                        style={{ ...styles.actionBtn, backgroundColor: '#28a745' }}
                        disabled={!file}
                    >
                        Submit Task
                    </button>
                </div>
            )}

            {task.status === 'Submitted' && <p style={{ color: 'green', fontWeight: 'bold' }}>✅ Submitted - Waiting for Review</p>}
            {task.status === 'Completed' && <p style={{ color: 'blue', fontWeight: 'bold' }}>🎉 Completed</p>}

        </div>
    );

    const getFilteredTasks = () => {
        switch (activeTab) {
            case 'New Tasks': return tasks.filter(t => t.status === 'Pending');
            case 'Active': return tasks.filter(t => t.status === 'In Progress');
            case 'Submitted': return tasks.filter(t => t.status === 'Submitted');
            case 'Completed': return tasks.filter(t => t.status === 'Completed');
            default: return [];
        }
    };

    if (!user) return <div>Loading...</div>;

    const stats = {
        new: tasks.filter(t => t.status === 'Pending').length,
        active: tasks.filter(t => t.status === 'In Progress').length,
        submitted: tasks.filter(t => t.status === 'Submitted').length,
        completed: tasks.filter(t => t.status === 'Completed').length,
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1>Welcome, {user.name}</h1>
                <p style={styles.subHeader}>Year · {user.department} Department</p>
                <button onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }} style={styles.logoutBtn}>Logout</button>
            </header>

            <div style={styles.statsGrid}>
                <div style={styles.statCard} onClick={() => setActiveTab('New Tasks')}>
                    <div style={{ ...styles.icon, backgroundColor: '#ffadad' }}>📥</div>
                    <h3>New Tasks</h3>
                    <h2>{stats.new}</h2>
                </div>
                <div style={styles.statCard} onClick={() => setActiveTab('Active')}>
                    <div style={{ ...styles.icon, backgroundColor: '#ffd6a5' }}>⚡</div>
                    <h3>Active</h3>
                    <h2>{stats.active}</h2>
                </div>
                <div style={styles.statCard} onClick={() => setActiveTab('Submitted')}>
                    <div style={{ ...styles.icon, backgroundColor: '#fdffb6' }}>📝</div>
                    <h3>Submitted</h3>
                    <h2>{stats.submitted}</h2>
                </div>
                <div style={styles.statCard} onClick={() => setActiveTab('Completed')}>
                    <div style={{ ...styles.icon, backgroundColor: '#caffbf' }}>✅</div>
                    <h3>Completed</h3>
                    <h2>{stats.completed}</h2>
                </div>
            </div>

            <div style={styles.tabs}>
                {['New Tasks', 'Active', 'Submitted', 'Completed'].map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        style={{ ...styles.tabBtn, backgroundColor: activeTab === tab ? '#007bff' : 'white', color: activeTab === tab ? 'white' : '#333' }}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            <div style={styles.taskList}>
                {loading ? <p>Loading tasks...</p> : (
                    getFilteredTasks().length > 0 ? getFilteredTasks().map(renderTaskCard) : (
                        <div style={styles.emptyState}>
                            <div style={styles.emptyIcon}>📄</div>
                            <p>No new tasks available</p>
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

const getPriorityColor = (p) => {
    switch (p) {
        case 'High': return '#ff6b6b';
        case 'Critical': return '#c0392b';
        case 'Medium': return '#f39c12';
        default: return '#2ecc71';
    }
};

const styles = {
    container: {
        padding: '40px',
        backgroundColor: '#f3f4f6',
        minHeight: '100vh',
        fontFamily: "'Inter', sans-serif",
    },
    header: {
        marginBottom: '40px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    subHeader: {
        color: '#666',
        fontSize: '14px',
        marginTop: '5px'
    },
    logoutBtn: {
        padding: '8px 16px',
        backgroundColor: '#dc3545',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '40px',
    },
    statCard: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        textAlign: 'center',
        cursor: 'pointer',
        boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
        transition: 'transform 0.2s',
    },
    icon: {
        width: '50px',
        height: '50px',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        margin: '0 auto 15px auto',
    },
    tabs: {
        display: 'flex',
        gap: '10px',
        marginBottom: '30px',
        flexWrap: 'wrap',
    },
    tabBtn: {
        padding: '10px 20px',
        border: '1px solid #ddd',
        borderRadius: '25px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'all 0.2s',
    },
    taskList: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '20px',
    },
    card: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    },
    cardTitle: {
        margin: '0 0 10px 0',
        fontSize: '18px',
    },
    cardDesc: {
        color: '#666',
        fontSize: '14px',
        marginBottom: '15px',
    },
    cardMeta: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: '#888',
        marginBottom: '20px',
    },
    actionBtn: {
        width: '100%',
        padding: '10px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    linkBtn: {
        textDecoration: 'none',
        color: '#007bff',
        fontWeight: 'bold',
        display: 'block',
    },
    emptyState: {
        gridColumn: '1 / -1',
        textAlign: 'center',
        padding: '40px',
        color: '#999',
    },
    emptyIcon: {
        fontSize: '48px',
        marginBottom: '10px',
    },
    submissionParams: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    fileInput: {
        fontSize: '14px'
    }
};
