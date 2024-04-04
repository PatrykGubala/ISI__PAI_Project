import React from 'react';
import Offert from '../Offert/Offert.jsx';
import './ProductsList.css';

const ProductsList = ({categories, products}) => {
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

    return (
        <div>

            <div className="products-list-wrapper">
                {o.map(product => (
                    <Offert key={product.id} product={product} />
                ))}




                {categories.map(category => (
                    <div key={category.categoryId}>
                        <h3>{category.name}</h3>
                        <p>{category.description}</p>
                    </div>
                ))}

                {products.map(product => (
                    <div key={product.id}>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                    </div>
                ))}




            </div>
        </div>
    );
};

export default ProductsList;