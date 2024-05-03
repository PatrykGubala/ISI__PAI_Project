import React, { useState } from 'react';
import './Advertisement.css';
import { PushpinFilled } from '@ant-design/icons';
import { Image, Carousel, Button } from 'antd';
import Header from '../../components/Header/Header.jsx';

const Advertisement = () => {
    const [showNumber, setShowNumber] = useState(false);
    const phoneNumber = '641 570 198';

    const handleShowNumber = () => {
        setShowNumber(!showNumber);
    };


    return (
        <div>
            <Header/>
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
                        <div className="date">Dodano 01.05.2024</div>

                        <div className="title">KROWA tanio SUPER inwestycja!!!</div>
                        <div className="price">15 000 zł</div>
                        <Button type="primary">Kup</Button>
                        <Button type="default" onClick={handleShowNumber}>
                            {showNumber ? phoneNumber : 'Pokaż numer'}
                        </Button>
                    </div>
                    <div className="advertisement-right">
                        <div className="location-title">LOKALIZACJA</div>
                        <div className="row">

                            <div> <PushpinFilled className="pushpin-icon"/> </div>
                            <div className="location">Gdynia</div>
                        </div>

                    </div>
                </div>
            </div>
            <div className="advertisement">
                <div className="advertisement-down">
                    <div className="description-title">OPIS</div>
                    <div className="description">
                        <p>Piękna krowa, daje dużo mleka. Mało je, ekonomiczna w utrzymaniu.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Advertisement;
