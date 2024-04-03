import React from 'react';
import Offer from '../Offer/Offer.jsx';
import './ProductsList.css';

const ProductsList = () => {
    const products = [
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

    return (
        <div>

            <div className="products-list-wrapper">
                {products.map(product => (
                    <Offer key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default ProductsList;
