import React from 'react';
import { Layout, theme } from 'antd';
import Header from '../../components/Header/Header.jsx';
import ProductsList from '../../components/ProductsList/ProductsList.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import './Main.css';

const { Content: AntContent } = Layout;



const Main = () => {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout>
            <Header/>
            <AntContent>
                <ProductsList />
            </AntContent>
            <Footer />
        </Layout>
    );
};

export default Main;
