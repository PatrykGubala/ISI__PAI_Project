import React, { useContext } from 'react';
import {Navigate, Outlet, useNavigate} from 'react-router-dom';
import { AuthContext } from './AuthContext.jsx';

const PrivateRoute = () => {
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useContext(AuthContext);
    const access_token = localStorage.getItem('access_token');

    console.log("isLoggedIn:", isLoggedIn);
    console.log("Access Token from localStorage:", access_token);

    if (!isLoggedIn || !access_token) {
        console.log("User is not logged in or access token is missing, redirecting to Login page");
        return <Navigate to="/Login" replace />;
    }

    const decodedToken = JSON.parse(atob(access_token.split('.')[1]));

    console.log("Decoded Access Token:", decodedToken);

    const isTokenExpired = decodedToken.exp * 1000 < Date.now();

    const expirationTimeInSeconds = decodedToken.exp;
    const expirationDate = new Date(expirationTimeInSeconds * 1000);
    console.log("Token expiration date:", expirationDate);

    if (isTokenExpired) {
        console.log("Access Token has expired, logging out and redirecting to Login page");
        logout();

        return <Navigate to="/Login" replace />;
    }

    console.log("Access Token is valid, allowing access to protected route");
    return <Outlet />;
};

export default PrivateRoute;
