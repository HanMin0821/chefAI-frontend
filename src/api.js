import axios from 'axios';

// Use relative requests so the dev server proxy (`/api`) forwards to backend.
// This lets the browser treat requests as same-origin and makes cookies/sessions work
// without cross-site SameSite issues in development.
const api = axios.create({
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;