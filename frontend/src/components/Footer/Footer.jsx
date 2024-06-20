import React from 'react';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer">
            Portal z ogłoszeniami ©{new Date().getFullYear()}
        </footer>
    );
};

export default Footer;
