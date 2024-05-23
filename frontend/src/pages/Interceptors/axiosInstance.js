import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Handling request token refresh if needed
axiosInstance.interceptors.request.use(async config => {
    const accessToken = localStorage.getItem('access_token');
    if (!accessToken) {
        console.log('No access token available.');
        return config;
    }

    const decodedToken = JSON.parse(atob(accessToken.split('.')[1]));
    if (decodedToken.exp * 1000 < Date.now()) {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
            throw new Error('Refresh token not found.');
        }

        try {
            const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, {
                headers: { 'Authorization': `Bearer ${refreshToken}` }
            });
            const { access_token } = response.data;
            localStorage.setItem('access_token', access_token);
            config.headers['Authorization'] = `Bearer ${access_token}`;
        } catch (error) {
            console.error('Failed to refresh token:', error);
            localStorage.clear();
            throw new Error('Session expired. Please log in again.');
        }
    } else {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
}, error => Promise.reject(error));

// Handling unauthorized responses globally
axiosInstance.interceptors.response.use(response => response, async error => {
    if (error.response && error.response.status === 401 && !error.config._retry) {
        error.config._retry = true;
        console.log('Attempting token refresh on 401 error.');

        try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) throw new Error('No refresh token available.');

            const res = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, {
                headers: { 'Authorization': `Bearer ${refreshToken}` }
            });

            localStorage.setItem('access_token', res.data.access_token);
            error.config.headers['Authorization'] = `Bearer ${res.data.access_token}`;

            return axiosInstance(error.config);
        } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);
            localStorage.clear();
            window.location = '/login'; // Redirect to login
            return Promise.reject(refreshError);
        }
    }

    return Promise.reject(error);
});

export default axiosInstance;
