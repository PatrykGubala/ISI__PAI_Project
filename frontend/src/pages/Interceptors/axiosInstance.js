import axios from 'axios';
import refreshAccessToken from './refreshAccessToken';
import { AuthContext } from '../../hooks/AuthContext';

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
        // Sprawdzenie, czy token wygasł
            if (accessToken) {
                config.headers['Authorization'] = `Bearer ${accessToken}`;
            }
            if (!accessToken || accessToken.trim() === '') {
                console.log('Access token not found');
                return config;
            }
            const decodedToken = JSON.parse(atob(accessToken.split('.')[1]));
            const isTokenExpired = decodedToken.exp * 1000 < Date.now();
        // Jeśli token wygasł, odśwież go
        if (isTokenExpired) {
            try {
                await refreshAccessToken();
                const newAccessToken = localStorage.getItem('access_token');
                config.headers['Authorization'] = `Bearer ${newAccessToken}`;
            } catch (error) {
                console.error('Error refreshing access token:', error.message);  
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
