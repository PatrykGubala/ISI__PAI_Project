import axios from 'axios';
import { AuthContext } from '../../hooks/AuthContext';
import {Navigate, Outlet, useNavigate} from 'react-router-dom';

const API_BASE_URL = 'http://localhost:8080';

const logout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
};

const refreshAccessToken = async () => {
   
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
        console.log('Access token refreshed successfully');
        return access_token;
    } catch (error) {
        console.error('Error refreshing access token:', error.message);
        logout();
        
    }
};

export default refreshAccessToken;
