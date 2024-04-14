import React from 'react';
import { Menu } from 'antd';
import { HomeOutlined, PlusOutlined, PhoneOutlined, UserOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();

    const handleMenuItemClick = (path) => {
        navigate(path);
    };

    const items = [
        { key: 'Home', label: 'Dom', icon: <HomeOutlined /> },
        { key: 'add-advertisement', label: 'Dodaj ogłoszenie', icon: <PlusOutlined /> },
        { key: 'contact', label: 'Kontakt', icon: <PhoneOutlined /> },
        { key: 'your-account', label: 'Twoje konto', icon: <UserOutlined /> },
        { key: 'login', label: 'Zaloguj', icon: <LoginOutlined /> },
        { key: 'register', label: 'Zarejestruj', icon: <UserAddOutlined /> }
    ];

    return (
        <header className="header">
            <div className="demo-logo" />
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['1']}
            >
                {items.map(item => (
                    <Menu.Item key={item.key} className="menu-item" onClick={() => handleMenuItemClick(`/${item.key}`)} icon={item.icon}>
                        {item.label}
                    </Menu.Item>
                ))}
            </Menu>
        </header>
    );
};

export default Header;
