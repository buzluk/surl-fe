import axios from 'axios';
const API_URL = 'http://localhost:8080/api/';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            if (status === 401 || status === 403) {
                localStorage.removeItem('token');
                window.location.href = '/signin';
                return Promise.reject(error);
            }

            const serverMessage = error.response?.data?.message;
            if (serverMessage) {
                return Promise.reject(new Error(serverMessage));
            }
        }
        return Promise.reject(error);
    }
);

export default api;