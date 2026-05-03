import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function EditProfile() {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        department: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
            setFormData({
                name: parsed.name || '',
                email: parsed.email || '',
                department: parsed.department || '',
                password: '',
                confirmPassword: ''
            });
        } else {
            router.push('/login');
        }
    }, [router]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');
        setLoading(true);

        if (formData.password && formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const updateData = {
                name: formData.name,
                department: formData.department,
                email: formData.email
            };
            if (formData.password) {
                updateData.password = formData.password;
            }

            const userId = user.id || user._id;
            if (!userId) {
                throw new Error('User ID not found. Please log out and log in again.');
            }

            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            const res = await fetch(`http://localhost:5000/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updateData),
            });

            // Check content type before parsing
            const contentType = res.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                const text = await res.text();
                // ... handle error
                throw new Error(`Server error: ${res.status} ${res.statusText}`);
            }

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to update user');

            // Update local storage
            const updatedUser = { ...user, ...data.user };
            localStorage.setItem('user', JSON.stringify(updatedUser)); // Fix: Ensure user struct matches
            setUser(updatedUser);
            setMessage('Profile updated successfully!');
            setTimeout(() => {
                router.push('/dashboard');
            }, 1000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Edit Profile</h2>
                {error && <div style={styles.error}>{error}</div>}
                {message && <div style={styles.success}>{message}</div>}
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={styles.input}
                            required
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Department</label>
                        <select
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            style={styles.input}
                        >
                            <option value="">Select Department</option>
                            <option value="CSE">CSE</option>
                            <option value="ECE">ECE</option>
                            <option value="EEE">EEE</option>
                            <option value="MECH">MECH</option>
                            <option value="CIVIL">CIVIL</option>
                            <option value="MET">MET</option>
                            <option value="IT">IT</option>
                            <option value="MBA">MBA</option>
                            <option value="PHARMACY">PHARMACY</option>
                            <option value="Computer Science">Computer Science</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Mechanical">Mechanical</option>
                            <option value="Civil">Civil</option>
                            <option value="Electrical">Electrical</option>
                        </select>
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>New Password (leave blank to keep current)</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="New Password"
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Confirm New Password</label>
                        <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            style={styles.input}
                            placeholder="Confirm Password"
                        />
                    </div>
                    <div style={styles.buttons}>
                        <button type="button" onClick={() => router.push('/dashboard')} style={styles.cancelBtn}>Cancel</button>
                        <button type="submit" style={styles.saveBtn} disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f3f4f6',
        padding: '20px',
        fontFamily: 'sans-serif',
    },
    card: {
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
        width: '100%',
        maxWidth: '500px',
    },
    title: {
        textAlign: 'center',
        marginBottom: '1.5rem',
        color: '#1f2937',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '0.5rem',
    },
    label: {
        fontWeight: 'bold',
        color: '#374151',
        fontSize: '0.9rem',
    },
    input: {
        padding: '0.75rem',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        fontSize: '1rem',
    },
    buttons: {
        display: 'flex',
        gap: '1rem',
        marginTop: '1rem',
    },
    saveBtn: {
        flex: 1,
        backgroundColor: '#10b981',
        color: 'white',
        padding: '0.75rem',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    cancelBtn: {
        flex: 1,
        backgroundColor: '#6b7280',
        color: 'white',
        padding: '0.75rem',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontWeight: 'bold',
    },
    error: {
        backgroundColor: '#fee2e2',
        color: '#991b1b',
        padding: '0.75rem',
        borderRadius: '4px',
        marginBottom: '1rem',
        textAlign: 'center',
    },
    success: {
        backgroundColor: '#d1fae5',
        color: '#065f46',
        padding: '0.75rem',
        borderRadius: '4px',
        marginBottom: '1rem',
        textAlign: 'center',
    }
};
