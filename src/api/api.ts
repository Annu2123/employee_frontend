import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000', // Adjust if backend runs on different port
    headers: {
        'Content-Type': 'application/json',
    },
});

export const loginUser = async (credentials: any) => {
    const response = await api.post('/login', credentials);
    return response.data;
};

export default api;
