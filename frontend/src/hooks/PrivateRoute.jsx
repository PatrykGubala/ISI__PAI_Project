import React, { useContext } from 'react';
import {Navigate, Outlet, useNavigate} from 'react-router-dom';
import { AuthContext } from './AuthContext.jsx';
import refreshAccessToken from '../pages/Interceptors/refreshAccessToken.js';


const PrivateRoute = () => {
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useContext(AuthContext);
    const access_token = localStorage.getItem('access_token');
    const refresh_token=localStorage.getItem('refresh_token');

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



    const decodedToken2 = JSON.parse(atob(refresh_token.split('.')[1]));
    const isTokenExpired2 = decodedToken2.exp * 1000 < Date.now();
    const expirationTimeInSeconds2 = decodedToken2.exp;
    const expirationDate2 = new Date(expirationTimeInSeconds2 * 1000);
    console.log("Refresh Token expiration date of refresh token:", expirationDate2);

    if (isTokenExpired2) {
        console.log("refressh Token has expired .........");
        logout();
     }

    console.log("Access Token is valid, allowing access to protected route");
    return <Outlet />;
};

export default PrivateRoute;