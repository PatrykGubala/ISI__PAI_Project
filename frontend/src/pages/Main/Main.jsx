import React, { useState, useEffect, useContext } from 'react';
import { Layout, theme, Pagination } from 'antd';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header/Header.jsx';
import ProductsList from '../../components/ProductsList/ProductsList.jsx';
import Footer from '../../components/Footer/Footer.jsx';
import Filter from "../../components/Filter/Filter.jsx";
import Search from "../../components/Search/Search.jsx";
import { AuthContext } from '../../hooks/AuthContext';
import axiosInstance from '../Interceptors/axiosInstance';
import './Main.css';

const { Content: AntContent } = Layout;

const Main = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const pageSize = 5;
    const navigate = useNavigate();
    const { login: authenticateUser } = useContext(AuthContext);

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const accessToken = queryParams.get('access_token');
        const refreshToken = queryParams.get('refresh_token');

        if (accessToken && refreshToken) {
            localStorage.setItem('access_token', accessToken);
            localStorage.setItem('refresh_token', refreshToken);
            authenticateUser();
            navigate('/');
        }
    }, [navigate, authenticateUser]);

    useEffect(() => {
        const fetchData = async (filters = {}) => {
            try {
                const queryString = new URLSearchParams({ ...filters, page: currentPage - 1, size: pageSize }).toString();
                const response = await axiosInstance.get(`/products?${queryString}`);
                setProducts(response.data.content);
                setTotalProducts(response.data.totalElements);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchData();
    }, [currentPage]);

    const handleFilter = async (values) => {
        const filters = {};

        if (values.category) filters.category = values.category;
        if (values.priceFrom) filters.minPrice = values.priceFrom;
        if (values.priceTo) filters.maxPrice = values.priceTo;

        Object.keys(values).forEach(key => {
            if (key.startsWith('attributes.')) {
                filters[key.substring(11)] = values[key];
            } else {
                filters[key] = values[key];
            }
        });
        Object.keys(filters).forEach(key => {
            if (filters[key] === undefined || filters[key] === 'undefined') {
                delete filters[key];
            }
        });
        try {
            const queryString = new URLSearchParams({ ...filters, page: 0, size: pageSize }).toString();
            const response = await axiosInstance.get(`/products?${queryString}`);
            setProducts(response.data.content);
            setTotalProducts(response.data.totalElements);
            setCurrentPage(1);
        } catch (error) {
            console.error('Error fetching filtered products:', error);
        }
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <Layout>
            <Header />
            <AntContent>
                <Search />
                <Filter handleFilter={handleFilter} />
                <ProductsList categories={categories} products={products} />
                <div className="pagination-container">
                    <Pagination
                        current={currentPage}
                        total={totalProducts}
                        pageSize={pageSize}
                        onChange={handlePageChange}
                    />
                </div>
            </AntContent>
            <Footer />
        </Layout>
    );
};

export default Main;
