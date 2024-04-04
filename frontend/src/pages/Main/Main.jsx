import React, { useState, useEffect } from 'react';
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

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const username = 'user';
    const password = 'password';

    useEffect(() => {
        const token = btoa(`${username}:${password}`);
        fetch('http://localhost:8080/api/categories', {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('All categories:', data);
                setCategories(data);
            })
            .catch(error => {
                console.error('Error fetching categories:', error);
            });

        fetch('http://localhost:8080/api/products', {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('All products:', data);
                setProducts(data);
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            });
    }, [username, password]);

    return (
        <Layout>
            <Header/>
            <AntContent>
                <ProductsList categories={categories} products={products}/>
            </AntContent>
            <Footer />
        </Layout>
    );
};

export default Main;