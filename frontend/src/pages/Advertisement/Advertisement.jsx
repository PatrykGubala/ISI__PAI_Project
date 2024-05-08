import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import './Advertisement.css';
import { PushpinFilled } from '@ant-design/icons';
import { Image, Carousel, Button } from 'antd';
import Header from '../../components/Header/Header.jsx';

const Advertisement = () => {
    const { id } = useParams();
    const [advertisementData, setAdvertisementData] = useState(null);
    const [showNumber, setShowNumber] = useState(false);
    const phoneNumber = '641 570 198';

    const handleShowNumber = () => {
        setShowNumber(!showNumber);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(`http://localhost:8080/products/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setAdvertisementData(data);
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
            <div className="row-boards">
                <div className="advertisement-left">
                    <Carousel autoplay>
                        <div>
                            <Image
                                width={600}
                                height={400}
                                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Krowa.jpg"
                                alt="Cow"
                            />
                        </div>
                        <div>
                            <Image
                                width={600}
                                height={400}
                                src="https://pfhb.pl/fileadmin/aktualnosci/2021/ciekawostki/sluch.JPG"
                                alt="Cow"
                            />
                        </div>
                        <div>
                            <Image
                                width={600}
                                height={400}
                                src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Cow_female_black_white.jpg/1200px-Cow_female_black_white.jpg"
                                alt="Cow"
                            />
                        </div>
                    </Carousel>
                </div>
                <div className="column">
                    <div className="advertisement-right">
                        <div className="date">Dodano {advertisementData.date}</div>
                        <div className="title">{advertisementData.name}</div>
                        <div className="price">{advertisementData.price} PLN</div>
                        <Button type="primary">Kup</Button>
                        <Button type="default" onClick={handleShowNumber}>
                            {showNumber ? phoneNumber : 'Pokaż numer'}
                        </Button>
                    </div>
                    <div className="advertisement-right">
                        <div className="location-title">LOKALIZACJA</div>
                        <div className="row">
                            <div><PushpinFilled className="pushpin-icon" /></div>
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
