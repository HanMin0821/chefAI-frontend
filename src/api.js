import axios from 'axios';

// Use 127.0.0.1:5001 by default to match backend running on port 5001.
const baseURL = 'http://127.0.0.1:5001';

const api = axios.create({
    baseURL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;