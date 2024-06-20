import React, { useContext, useEffect, useState } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext.jsx';
import axiosInstance from '../pages/Interceptors/axiosInstance';

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
                    const response = await axiosInstance.post('/auth/refresh-token', {}, {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('refresh_token')}`
                        }
                    });
                    const { access_token, refresh_token } = response.data;
                    localStorage.setItem('access_token', access_token);
                    localStorage.setItem('refresh_token', refresh_token);
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
