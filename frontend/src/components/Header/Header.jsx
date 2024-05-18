import React, { useContext, useState } from 'react';
import { Menu } from 'antd';
import { HomeOutlined, PlusOutlined, PhoneOutlined, UserOutlined, LoginOutlined, UserAddOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './../../hooks/AuthContext';
import './Header.css';
import AdminAdvertisementDrawer from '../../components/AdminAdvertisementDrawer/AdminAdvertisementDrawer';

const Header = () => {
    const navigate = useNavigate();
    const { isLoggedIn, logout } = useContext(AuthContext);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleMenuItemClick = (path) => {
        navigate(path);
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const handleAdmin = () => {
        setDrawerOpen(true);
    };

    const isAdmin = () => {
        const userRole = localStorage.getItem('user_role');
        return userRole === 'admin';
    };

    const items = isLoggedIn ? [
        { key: '', label: 'Dom', icon: <HomeOutlined /> },
        { key: 'AddAdvertisement', label: 'Dodaj ogłoszenie', icon: <PlusOutlined /> },
        { key: 'Contact', label: 'Kontakt', icon: <PhoneOutlined /> },
        { key: 'Profil', label: 'Twoje konto', icon: <UserOutlined /> },
        ...(isAdmin() ? [{ key: 'Admin', label: 'Admin', icon: <LogoutOutlined />, onClick: handleAdmin }] : []),
        { key: 'Logout', label: 'Wyloguj', icon: <LogoutOutlined />, onClick: handleLogout }
    ] : [
        { key: '', label: 'Dom', icon: <HomeOutlined /> },
        { key: 'AddAdvertisement', label: 'Dodaj ogłoszenie', icon: <PlusOutlined /> },
        { key: 'Contact', label: 'Kontakt', icon: <PhoneOutlined /> },
        { key: 'Login', label: 'Zaloguj', icon: <LoginOutlined /> },
        { key: 'Register', label: 'Zarejestruj', icon: <UserAddOutlined /> }
    ];

    return (
        <header className="header">
            <div className="demo-logo" />
            <Menu
                theme="dark"
                mode="horizontal"
            >
                {items.map(item => (
                    <Menu.Item key={item.key} className="menu-item" onClick={item.onClick ? item.onClick : () => handleMenuItemClick(`/${item.key}`)} icon={item.icon}>
                        {item.label}
                    </Menu.Item>
                ))}
            </Menu>
            <AdminAdvertisementDrawer open={drawerOpen} setOpen={setDrawerOpen} />
        </header>
    );
};

export default Header;
