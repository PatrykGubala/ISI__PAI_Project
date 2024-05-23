import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext.jsx';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
        throw new Error('Refresh token not found');
    }

    const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {}, {
        headers: {
            Authorization: `Bearer ${refreshToken}`
        }
    });

    const { access_token, refresh_token } = response.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
    return access_token;
};

const PrivateRoute = () => {
    const { isLoggedIn, login, logout } = useContext(AuthContext);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuthentication = async () => {
            const accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                logout();
                navigate('/Login', { replace: true });
                return;
            }

            const decodedToken = JSON.parse(atob(accessToken.split('.')[1]));
            const isTokenExpired = decodedToken.exp * 1000 < Date.now();

            if (isTokenExpired) {
                try {
                    await refreshAccessToken();
                    login();
                } catch (error) {
                    console.error('Error refreshing access token:', error.message);
                    logout();
                    navigate('/Login', { replace: true });
                }
            } else {
                login();
            }

            setLoading(false);
        };

        checkAuthentication();
    }, [login, logout, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return isLoggedIn ? <Outlet /> : <Navigate to="/Login" replace />;
};

export default PrivateRoute;
