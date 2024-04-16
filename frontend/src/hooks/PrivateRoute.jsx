import React, { useContext } from 'react';
import {Navigate, Outlet} from 'react-router-dom';
import { AuthContext } from './AuthContext.jsx';
const PrivateRoute = () => {
    const { isLoggedIn } = useContext(AuthContext);

    return isLoggedIn ? (
        <Outlet />
    ) : (
        <Navigate to="/Login" replace />
    );
};

export default PrivateRoute;