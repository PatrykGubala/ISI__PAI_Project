import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, theme, Pagination } from 'antd';
import './Success.css'

const SuccessPage = () => {
    return (
        <Layout className="success-page">

            <div>
                <h2>Płatność udana!</h2>
                <p>Dziękujemy za twój zakup.</p>
                <Link to="/">Powrót do strony głównej</Link>
            </div>
        </Layout>
    );
};

export default SuccessPage;
