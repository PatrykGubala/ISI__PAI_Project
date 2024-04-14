import React, { useState, useEffect } from 'react';
import { Layout, theme } from 'antd';
import Header from '../../components/Header/Header.jsx';
import ProductsList from '../../components/ProductsList/ProductsList.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import Filter from "../../components/Filter/Filter.jsx";
import Search from "../../components/Search/Search.jsx"
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

    const o = [
        {
            id: 1,
            name: 'Eleganckie krzesło do salonu',
            price: '50 PLN',
            date: '2024-04-05',
            location: 'Kielce',
            image: 'https://domartstyl.com/wp-content/uploads/2021/04/1-nowoczesne-kremowe-krzeslo-welurowe-do-jadalni-altura-ideal-gold-150x150.jpg'
        },
        {
            id: 2,
            name: 'TOYOTA YARIS CROSS !!! SUPER CENA !!! OKAZJA',
            price: '70 000 PLN',
            date: '2024-04-06',
            location: 'Warszawa',
            image: 'https://truck-van.pl/wp-content/uploads/2023/02/truckvan_toyota_yaris_cross_2022_28-150x150.jpg'
        },
    ];


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


    const handleFilter = (values) => {
        console.log('Filtrowanie z wartościami:', values);
    };



    return (
        <Layout>
            <Header/>
            <AntContent>
                <Search/>
                <Filter handleFilter={handleFilter} />

                <ProductsList categories={categories} products={products} o={o} />
            </AntContent>
            <Footer />
        </Layout>
    );
};

export default Main;