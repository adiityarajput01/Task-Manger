import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={styles.nav}>
            <h2 style={styles.logo}>TaskManager</h2>
            {user ? (
                <div style={styles.links}>
                    <Link to="/dashboard" style={styles.link}>Dashboard</Link>
                    <Link to="/tasks" style={styles.link}>Tasks</Link>
                    <span style={styles.username}>Hi, {user.name}</span>
                    <button onClick={handleLogout} style={styles.button}>
                        Logout
                    </button>
                </div>
            ) : (
                <div style={styles.links}>
                    <Link to="/login" style={styles.link}>Login</Link>
                    <Link to="/register" style={styles.link}>Register</Link>
                </div>
            )}
        </nav>
    );
}

const styles = {
    nav: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 30px',
        backgroundColor: '#2c3e50',
        color: 'white'
    },
    logo: { margin: 0, color: 'white' },
    links: { display: 'flex', alignItems: 'center', gap: '20px' },
    link: { color: 'white', textDecoration: 'none' },
    username: { color: '#3498db' },
    button: {
        padding: '8px 16px',
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    }
};

export default Navbar;