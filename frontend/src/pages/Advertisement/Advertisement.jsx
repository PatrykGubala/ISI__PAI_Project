import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Spin } from 'antd';
import Header from '../../components/Header/Header.jsx';
import AdminAdvertisementDrawer from "../../components/AdminAdvertisementDrawer/AdminAdvertisementDrawer.jsx";
import axiosInstance from '../Interceptors/axiosInstance';
import './Advertisement.css';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const Advertisement = () => {
    const { id } = useParams();
    const [advertisementData, setAdvertisementData] = useState(null);
    const [showNumber, setShowNumber] = useState(false);
    const phoneNumber = '641 570 198';
    const navigate = useNavigate();

    const handleShowNumber = () => {
        setShowNumber(!showNumber);
    };

    const handlePurchase = () => {
        navigate(`/purchase/${id}`);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axiosInstance.get(`/products/${id}`);
                setAdvertisementData(response.data);
            } catch (error) {
                console.error('Error fetching advertisement data:', error);
            }
        };

        fetchData();
    }, [id]);

    if (!advertisementData) {
        return <div className="loading-container"><Spin size="large" /></div>;
    }

    return (
        <div className="advertisement-container">
            <Header />
            <AdminAdvertisementDrawer advertisementData={advertisementData} />

            <div className="row-boards">
                <div className="advertisement-left">
                    <Carousel showThumbs={false}>
                        {advertisementData.images.map((image, index) => (
                            <div key={index} className="carousel-image-container">
                                <img
                                    src={image.imageUrl}
                                    alt={advertisementData.name}
                                    className="carousel-image"
                                />
                            </div>
                        ))}
                    </Carousel>
                </div>
                <div className="column advertisement-right">
                    <div className="date">Dodano {advertisementData.date}</div>
                    <div className="title">{advertisementData.name}</div>
                    <div className="price">{advertisementData.price} PLN</div>
                    <Button type="primary" onClick={handlePurchase}>
                        Kup
                    </Button>
                    <Button type="default" onClick={handleShowNumber}>
                        {showNumber ? phoneNumber : 'Pokaż numer'}
                    </Button>
                    <div className="location-title">LOKALIZACJA</div>
                    <div className="row location">
                        <div className="pushpin-icon" />
                        <div>{advertisementData.location}</div>
                    </div>
                </div>
            </div>
            <div className="advertisement description-container">
                <div className="description-title">OPIS PRODUKTU</div>
                <div className="description">
                    <p>{advertisementData.description}</p>
                </div>
            </div>
        </div>
    );
}

export default Advertisement;