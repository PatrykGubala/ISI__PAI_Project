import React, { useState, useEffect } from 'react';
import { Layout, Typography, Image, Input, Button, Spin, Card, Tabs, Pagination } from 'antd';
import axiosInstance from '../Interceptors/axiosInstance';
import Header from '../../components/Header/Header';
import ProductsList from '../../components/ProductsList/ProductsList';
import { Link } from 'react-router-dom';
import './Profil.css';

const { Content: AntContent } = Layout;
const { Title } = Typography;

const Profil = () => {
    const [profileData, setProfileData] = useState({});
    const [loading, setLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const username = localStorage.getItem('username');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const pageSize = 5;

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                let response;
                response = await axiosInstance.post('/auth/refresh-token');
                const access_token = response.data.access_token;
                const refresh_token = response.data.refresh_token;
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', refresh_token);
                response = await axiosInstance.get('/user/profile');
                const userData = response.data;
                setProfileData(userData);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        fetchProfileData();
    }, [username]);

    const fetchProductsData = async (page) => {
        try {
            const response = await axiosInstance.get(`/user/products?page=${page - 1}&size=${pageSize}`);
            setProducts(response.data);
            setTotalProducts(response.data.length);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchProductsData(currentPage);
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    if (loading) {
        return (
            <div className="loading">
                <Spin size="large" />
            </div>
        );
    }

    const items = [
        {
            key: '1',
            label: 'Twoje ogłoszenia',
            children: (
                <div>
                    <ProductsList categories={[]} products={products} />
                    <div className="pagination-container">
                        <Pagination
                            current={currentPage}
                            total={totalProducts}
                            pageSize={pageSize}
                            onChange={handlePageChange}
                        />
                    </div>
                </div>
            ),
        },
        {
            key: '2',
            label: 'Historia zakupów',
            children: (
                <Card className="history-card" hoverable>
                    <div className="history-details">
                        <h3>Historia</h3>
                    </div>
                </Card>
            ),
        },
        {
            key: '3',
            label: 'Płatności',
            children: 'Content of Tab Pane 3',
        },
    ];

    return (
        <Layout>
            <Header />
            <AntContent>
                <div className="profile-page">
                    <div className="profile-header">
                        <Title level={2}>Strona użytkownika: {username}</Title>
                    </div>
                    <div className="profile-content">
                        <div className="profile-image">
                            <Image
                                width={300}
                                height={175}
                                src="https://pfhb.pl/fileadmin/aktualnosci/2021/ciekawostki/sluch.JPG"
                                alt="Profile"
                            />
                        </div>
                        <div className="profile-details">
                            <Title level={3}>Twoje Dane</Title>
                            <div className="profile-info">
                                <div>
                                    <strong>Imię i Nazwisko:</strong>
                                    <Input className="input" name="fullName"
                                           value={`${profileData.firstName} ${profileData.lastName}`} readOnly/>
                                </div>
                                <div>
                                    <strong>Email:</strong>
                                    <Input className="input" name="email" value={profileData.email} readOnly/>
                                </div>
                                <div>
                                    <strong>Numer telefonu:</strong>
                                    <Input className="input" name="phoneNumber" value={profileData.phoneNumber}
                                           readOnly/>
                                </div>
                            </div>
                            <div className="edit-button">
                                <Link to="/edit-profile">
                                    <Button type="primary">Edytuj dane</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="profile-tabs">
                        <Tabs defaultActiveKey="1" items={items}/>
                    </div>
                </div>
            </AntContent>
        </Layout>
    );
};

export default Profil;
