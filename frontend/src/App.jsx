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
import Profil from "./pages/Profil/Profil.jsx"
import ManageCategory from "./pages/ManageCategory/ManageCategory.jsx"
import Purchase from "./pages/Purchase/Purchase.jsx";
import Contact from "./pages/Contact/Contact.jsx";
import AdminInbox from "./pages/AdminInbox/AdminInbox.jsx";
import Success from "./pages/Success/Success.jsx";
import Confirmation from "./pages/Confirmation/Confirmation.jsx";
import Error from "./pages/Error/Error.jsx"
import AdminPay from "./pages/AdminPay/AdminPay.jsx"
const App = () => {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route exact path="/" element={<Main />} />
                    <Route exact path="/Login" element={<Login />} />
                    <Route exact path="/Register" element={<Register />} />
                    <Route exact path="/advertisement/:id" element={<Advertisement />} />

                    <Route element={<PrivateRoute />}>
                        <Route exact path="/AddAdvertisement" element={<AddAdvertisement />} />
                        <Route exact path="/ManageCategory" element={<ManageCategory />} />
                        <Route exact path="/Profil" element={<Profil />} />
                        <Route exact path="/purchase/:id" element={<Purchase />} />
                        <Route exact path="/Contact" element={<Contact />} />
                        <Route exact path="/AdminInbox" element={<AdminInbox />} />
                        {/*<Route exact path="/payment/:id" element={<Payment />} />*/}
                        <Route exact path="/Success" element={<Success />} />
                        <Route exact path="/Confirmation" element={<Confirmation />} />
                        <Route exact path="/Error" element={<Error />} />
                        <Route exact path="/AdminPay" element={<AdminPay />} />

                    </Route>
                    <Route exact path="*" element={<Error404 />} />

                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
};

export default App;
