import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { Link } from 'react-router-dom';

function Dashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user, token } = useAuth();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await api.get('/tasks/stats', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStats(response.data);
        } catch (err) {
            console.error('Failed to fetch stats:', err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <p style={styles.loading}>Loading...</p>;

    return (
        <div style={styles.container}>
            <h2>Welcome back, {user?.name}! 👋</h2>
            <p style={styles.subtitle}>Here's your task overview</p>

            <div style={styles.statsGrid}>
                <div style={{ ...styles.statCard, backgroundColor: '#3498db' }}>
                    <h3>Total Tasks</h3>
                    <p style={styles.statNumber}>{stats?.total || 0}</p>
                </div>
                <div style={{ ...styles.statCard, backgroundColor: '#2ecc71' }}>
                    <h3>Completed</h3>
                    <p style={styles.statNumber}>{stats?.completed || 0}</p>
                </div>
                <div style={{ ...styles.statCard, backgroundColor: '#e74c3c' }}>
                    <h3>Pending</h3>
                    <p style={styles.statNumber}>{stats?.pending || 0}</p>
                </div>
                <div style={{ ...styles.statCard, backgroundColor: '#f39c12' }}>
                    <h3>In Progress</h3>
                    <p style={styles.statNumber}>{stats?.inProgress || 0}</p>
                </div>
            </div>

            <div style={styles.progressContainer}>
                <p>Completion Rate: {stats?.completionPercentage || 0}%</p>
                <div style={styles.progressBar}>
                    <div style={{
                        ...styles.progressFill,
                        width: `${stats?.completionPercentage || 0}%`
                    }} />
                </div>
            </div>

            <Link to="/tasks" style={styles.button}>
                View All Tasks →
            </Link>
        </div>
    );
}

const styles = {
    container: { padding: '30px', maxWidth: '900px', margin: '0 auto' },
    subtitle: { color: '#666', marginBottom: '30px' },
    loading: { textAlign: 'center', marginTop: '50px' },
    statsGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
        marginBottom: '30px'
    },
    statCard: {
        padding: '20px',
        borderRadius: '8px',
        color: 'white',
        textAlign: 'center'
    },
    statNumber: { fontSize: '2.5rem', fontWeight: 'bold', margin: 0 },
    progressContainer: { marginBottom: '30px' },
    progressBar: {
        height: '20px',
        backgroundColor: '#ecf0f1',
        borderRadius: '10px',
        overflow: 'hidden'
    },
    progressFill: {
        height: '100%',
        backgroundColor: '#2ecc71',
        transition: 'width 0.3s ease'
    },
    button: {
        display: 'inline-block',
        padding: '12px 24px',
        backgroundColor: '#2c3e50',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '4px'
    }
};

export default Dashboard;