import React from 'react';
import Main from './pages/Main/Main.jsx';
import './App.css';
import Register from "./pages/Register/Register.jsx";
import Login from "./pages/Login/Login.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                    <Route exact path="/" element={<Main />} />
                    <Route exact path="/Register" element={<Register />} />
                    <Route exact path="/Login" element={<Login />} />
            </Routes>
        </BrowserRouter>

            );
};

export default App;
