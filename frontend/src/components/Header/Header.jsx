import React from 'react';
import { Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
    const navigate = useNavigate();

    const handleMenuItemClick = (path) => {
        if (path === '/register') {
            navigate(path);
        }
    };

    const items = [
        { key: 'search', label: 'Szukaj' },
        { key: 'add-advertisement', label: 'Dodaj ogłoszenie' },
        { key: 'contact', label: 'Kontakt' },
        { key: 'your-account', label: 'Twoje konto' },
        { key: 'login', label: 'Zaloguj' },
        { key: 'register', label: 'Zarejestruj' }
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
                    <Menu.Item key={item.key} onClick={() => handleMenuItemClick(`/${item.key}`)}>
                        {item.label}
                    </Menu.Item>
                ))}
            </Menu>
        </header>
    );
};

export default Header;
