import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function Tasks() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [priority, setPriority] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [newTask, setNewTask] = useState({
        title: '', description: '', priority: 'medium', dueDate: ''
    });
    const { token } = useAuth();

    const headers = { Authorization: `Bearer ${token}` };

    useEffect(() => {
        fetchTasks();
    }, [search, priority]);

    const fetchTasks = async () => {
        try {
            let url = '/tasks?';
            if (search) url += `search=${search}&`;
            if (priority) url += `priority=${priority}`;
            const response = await api.get(url, { headers });
            setTasks(response.data.tasks);
        } catch (err) {
            console.error('Failed to fetch tasks:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/tasks', newTask, { headers });
            setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
            setShowForm(false);
            fetchTasks();
        } catch (err) {
            console.error('Failed to create task:', err);
        }
    };

    const handleStatusChange = async (taskId, status) => {
        try {
            await api.patch(`/tasks/${taskId}/status`, { status }, { headers });
            fetchTasks();
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    const handleDelete = async (taskId) => {
        try {
            await api.delete(`/tasks/${taskId}`, { headers });
            fetchTasks();
        } catch (err) {
            console.error('Failed to delete task:', err);
        }
    };

    const priorityColor = {
        high: '#e74c3c',
        medium: '#f39c12',
        low: '#2ecc71'
    };

    if (loading) return <p style={{ textAlign: 'center' }}>Loading...</p>;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h2>My Tasks</h2>
                <button
                    style={styles.addButton}
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancel' : '+ Add Task'}
                </button>
            </div>

            {/* Create Task Form */}
            {showForm && (
                <div style={styles.form}>
                    <h3>Create New Task</h3>
                    <form onSubmit={handleCreate}>
                        <input
                            style={styles.input}
                            placeholder="Task title"
                            value={newTask.title}
                            onChange={(e) => setNewTask({
                                ...newTask, title: e.target.value
                            })}
                            required
                        />
                        <input
                            style={styles.input}
                            placeholder="Description (optional)"
                            value={newTask.description}
                            onChange={(e) => setNewTask({
                                ...newTask, description: e.target.value
                            })}
                        />
                        <select
                            style={styles.input}
                            value={newTask.priority}
                            onChange={(e) => setNewTask({
                                ...newTask, priority: e.target.value
                            })}
                        >
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                        </select>
                        <input
                            style={styles.input}
                            type="date"
                            value={newTask.dueDate}
                            onChange={(e) => setNewTask({
                                ...newTask, dueDate: e.target.value
                            })}
                        />
                        <button style={styles.addButton} type="submit">
                            Create Task
                        </button>
                    </form>
                </div>
            )}

            {/* Search & Filter */}
            <div style={styles.filters}>
                <input
                    style={{ ...styles.input, width: '300px' }}
                    placeholder="Search tasks..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <select
                    style={{ ...styles.input, width: '200px' }}
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option value="">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>

            {/* Task List */}
            {tasks.length === 0 ? (
                <p style={styles.noTasks}>No tasks found. Create one!</p>
            ) : (
                tasks.map(task => (
                    <div key={task._id} style={styles.taskCard}>
                        <div style={styles.taskHeader}>
                            <h3 style={styles.taskTitle}>{task.title}</h3>
                            <span style={{
                                ...styles.priority,
                                backgroundColor: priorityColor[task.priority]
                            }}>
                                {task.priority}
                            </span>
                        </div>

                        {task.description && (
                            <p style={styles.description}>{task.description}</p>
                        )}

                        {task.dueDate && (
                            <p style={styles.dueDate}>
                                Due: {new Date(task.dueDate).toLocaleDateString()}
                            </p>
                        )}

                        <div style={styles.taskFooter}>
                            <select
                                style={styles.statusSelect}
                                value={task.status}
                                onChange={(e) => handleStatusChange(
                                    task._id, e.target.value
                                )}
                            >
                                <option value="pending">Pending</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>

                            <button
                                style={styles.deleteButton}
                                onClick={() => handleDelete(task._id)}
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}

const styles = {
    container: { padding: '30px', maxWidth: '900px', margin: '0 auto' },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px'
    },
    addButton: {
        padding: '10px 20px',
        backgroundColor: '#2c3e50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    form: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
        marginBottom: '20px'
    },
    filters: {
        display: 'flex',
        gap: '15px',
        marginBottom: '20px'
    },
    input: {
        width: '100%',
        padding: '10px',
        marginBottom: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '14px',
        boxSizing: 'border-box'
    },
    taskCard: {
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '15px'
    },
    taskHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '10px'
    },
    taskTitle: { margin: 0 },
    priority: {
        padding: '4px 12px',
        borderRadius: '20px',
        color: 'white',
        fontSize: '12px',
        textTransform: 'uppercase'
    },
    description: { color: '#666', marginBottom: '10px' },
    dueDate: { color: '#999', fontSize: '13px' },
    taskFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '10px'
    },
    statusSelect: {
        padding: '8px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    deleteButton: {
        padding: '8px 16px',
        backgroundColor: '#e74c3c',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer'
    },
    noTasks: { textAlign: 'center', color: '#999', marginTop: '50px' }
};

export default Tasks;