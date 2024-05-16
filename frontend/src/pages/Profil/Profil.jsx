import React, { useState, useEffect } from 'react';
import { Layout, Typography, Image, Input, Button } from 'antd';
import axiosInstance from '../Interceptors/axiosInstance.js';
import Header from '../../components/Header/Header.jsx';
import ProductsList from '../../components/ProductsList/ProductsList.jsx';
import Error404 from '../Error404/Error404.jsx';
import { Link } from 'react-router-dom';
import './Profil.css';

const { Content: AntContent } = Layout;
const { Title } = Typography;

const Profil = () => {
    const [profileData, setProfileData] = useState('');
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const username = localStorage.getItem('username');

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const token = btoa(`${username}:password`);
                const response = await axiosInstance.get(`/profile/${userUuid}`, {
                    headers: {
                        'Authorization': `Basic ${token}`
                    }
                });
                const userData = response.data;
                if (userData) {
                    setProfileData({
                        firstName: userData.firstName,
                        lastName: userData.lastName,
                        email: userData.email,
                        phoneNumber: userData.phoneNumber
                    });
                    setLoading(false);
                } else {
                    console.error('No user data found');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        const fetchProductsData = async () => {
            try {
                const response = await fetch('http://localhost:8080/products?page=0&size=5');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log('All products:', data.content);
                setProducts(data.content);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProfileData();
        fetchProductsData();
    }, [username]);

    return (
        <div>
            <Header />
            <div className="Top">
                <h2>Strona użytkownika: {username}</h2>
            </div>
            <div className="main">
                <div className="profil-container1">
                    <Image
                        width={300}
                        height={175}
                        src="https://pfhb.pl/fileadmin/aktualnosci/2021/ciekawostki/sluch.JPG"
                        alt="Cow"
                    />
                </div>
                <div className="profil-container">
                    <h2>Twoje Dane </h2>
                    <div className="profile-info">
                        <div>
                            <strong>Imię i Nazwisko:</strong> <Input className="inputt" name="fullName" value={`${profileData.firstName} ${profileData.lastName}`} />
                        </div>
                        <div>
                            <strong>Email:</strong> <Input className="inputt" name="email" value={profileData.email} />
                        </div>
                        <div>
                            <strong>Numer telefonu:</strong> <Input className="inputt" name="phoneNumber" value={profileData.phoneNumber} />
                        </div>
                    </div>
                    <div className="blue">
                        <Link to="/error404">
                            <Button type="primary">Edytuj dane</Button>
                        </Link>
                    </div>
                </div>
            </div>
            <div className="bottom">
                <p className="title1">Twoje Ogłoszenia</p>
                <div>
                    <ProductsList categories={categories} products={products} />
                </div>
            </div>
        </div>
    );
};

export default Profil;
