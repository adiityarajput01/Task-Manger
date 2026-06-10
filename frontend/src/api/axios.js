import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP__API_URL || 'http://localhost:5000/api'
});

export default api;