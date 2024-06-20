import React from 'react';
import { Link } from 'react-router-dom';
import { Layout, theme, Pagination } from 'antd';
import './TransferInfo.css'

const TransferInfo = () => {
    return (
        <Layout className="transfer-page">

            <div>
                <h2>Ostatni krok...</h2>
                <p>Dokonaj przelewu w ciągu 3 dnich roboczych na:</p>
                <p>09876543210987654321 </p>
                <p>M-bank </p>
                <p>ul. Testowa 2, 99-999 Kraków, Polska</p>

                <Link to="/">Powrót do strony głównej</Link>
            </div>
        </Layout>
    );
};

export default TransferInfo;
