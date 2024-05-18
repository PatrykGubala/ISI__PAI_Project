import React, { useState, useEffect } from 'react';
import { useParams, useNavigate} from 'react-router-dom';
import { Image, Carousel, Button } from 'antd';
import Header from '../../components/Header/Header.jsx';
import AdminAdvertisementDrawer from "../../components/AdminAdvertisementDrawer/AdminAdvertisementDrawer.jsx";
import axiosInstance from '../Interceptors/axiosInstance';
import './Advertisement.css';

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
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Header />
            <AdminAdvertisementDrawer advertisementData={advertisementData} />

            <div className="row-boards">
                <div className="advertisement-left">
                    <Carousel autoplay>
                        {advertisementData.images.map((image) => (
                            <div key={image.id}>
                                <Image
                                    width={600}
                                    height={400}
                                    src={image.imageUrl}
                                    alt={advertisementData.name}
                                />
                            </div>
                        ))}
                    </Carousel>
                </div>
                <div className="column">
                    <div className="advertisement-right">
                        <div className="date">Dodano {advertisementData.date}</div>
                        <div className="title">{advertisementData.name}</div>
                        <div className="price">{advertisementData.price} PLN</div>
                        <Button type="primary" onClick={handlePurchase}>
                            Kup
                        </Button>
                        <Button type="default" onClick={handleShowNumber}>
                            {showNumber ? phoneNumber : 'Pokaż numer'}
                        </Button>
                    </div>
                    <div className="advertisement-right">
                        <div className="location-title">LOKALIZACJA</div>
                        <div className="row">
                            <div className="pushpin-icon" />
                            <div className="location">{advertisementData.location}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="advertisement">
                <div className="advertisement-down">
                    <div className="description-title">OPIS</div>
                    <div className="description">
                        <p>{advertisementData.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Advertisement;
