import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken || accessToken.trim() === '') {
            console.log('Access token not found');
            return config;
        }

        const decodedToken = JSON.parse(atob(accessToken.split('.')[1]));
        const isTokenExpired = decodedToken.exp * 1000 < Date.now();

        if (isTokenExpired) {
            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) {
                    throw new Error('Refresh token not found');
                }

                const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`
                    }
                });

                const { access_token } = response.data;
                localStorage.setItem('access_token', access_token);
                config.headers['Authorization'] = `Bearer ${access_token}`;
                console.log('Access token refreshed successfully');
            } catch (error) {
                console.error('Error refreshing access token:', error.message);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user_role');
                throw error;
            }
        } else {
            config.headers['Authorization'] = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) {
                    throw new Error('Refresh token not found');
                }

                const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, {
                    headers: {
                        Authorization: `Bearer ${refreshToken}`
                    }
                });

                const { access_token } = response.data;
                localStorage.setItem('access_token', access_token);
                originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
                return axiosInstance(originalRequest);
            } catch (error) {
                console.error('Error refreshing access token:', error.message);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user_role');
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
