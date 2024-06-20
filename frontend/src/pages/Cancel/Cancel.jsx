import React from 'react';
import { Link } from 'react-router-dom';
import './Cancel.css';
import {Layout} from "antd";

const Cancel = () => {

        return (
            <Layout className="cancel-page">

                <div>
                    <h2>Płatność udana!</h2>
                    <p>Dziękujemy za twój zakup.</p>
                    <Link to="/">Powrót do strony głównej</Link>
                </div>
            </Layout>
        );
    };


export default Cancel;
