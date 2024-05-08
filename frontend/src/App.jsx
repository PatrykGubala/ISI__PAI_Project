import React from 'react';
import Main from './pages/Main/Main.jsx';
import './App.css';
import Register from "./pages/Register/Register.jsx";
import Login from "./pages/Login/Login.jsx";
import Advertisement from "./pages/Advertisement/Advertisement.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/AuthContext.jsx";
import PrivateRoute from "./hooks/PrivateRoute.jsx";
import Error404 from "./pages/Error404/Error404.jsx";
import AddAdvertisement from "./pages/AddAdvertisement/AddAdvertisement.jsx";

const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route exact path="/" element={<Main />} />
                    <Route exact path="/Login" element={<Login />} />
                    <Route exact path="/Register" element={<Register />} />

                    <Route element={<PrivateRoute />}>
                        <Route exact path="/advertisement/:id" element={<Advertisement />} />
                        <Route exact path="/AddAdvertisement" element={<AddAdvertisement />} />

                    </Route>
                    <Route exact path="*" element={<Error404 />} />

                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;
