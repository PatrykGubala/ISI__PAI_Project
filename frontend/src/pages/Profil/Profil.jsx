import React, { useState, useEffect } from 'react';
import { Layout, Typography, Image, Input, Button, Spin } from 'antd';
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

        const fetchProductsData = async () => {
            try {
                let response;
                response = await axiosInstance.post('/auth/refresh-token');
                const access_token = response.data.access_token;
                const refresh_token = response.data.refresh_token;
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', refresh_token);
                response = await axiosInstance.get('/products?page=0&size=5');
                setProducts(response.data.content);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProfileData();
        fetchProductsData();
    }, [username]);

    if (loading) {
        return (
            <div className="loading">
                <Spin size="large" />
            </div>
        );
    }

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
                                    <Input className="input" name="fullName" value={`${profileData.firstName} ${profileData.lastName}`} readOnly />
                                </div>
                                <div>
                                    <strong>Email:</strong>
                                    <Input className="input" name="email" value={profileData.email} readOnly />
                                </div>
                                <div>
                                    <strong>Numer telefonu:</strong>
                                    <Input className="input" name="phoneNumber" value={profileData.phoneNumber} readOnly />
                                </div>
                            </div>
                            <div className="edit-button">
                                <Link to="/edit-profile">
                                    <Button type="primary">Edytuj dane</Button>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="profile-products">
                        <Title level={3}>Twoje Ogłoszenia</Title>
                        <ProductsList categories={[]} products={products} />
                    </div>
                </div>
            </AntContent>
        </Layout>
    );
};

export default Profil;
