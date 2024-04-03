import React from 'react';
import { Card } from 'antd';
import './Offer.css';

const Product = ({ product }) => {
    return (
        <Card className="product-card" hoverable>
            <div className="product-info">
                <div className="product-image">
                    <img src={product.image} alt={product.name} />
                </div>
                <div className="product-details">
                    <h3>{product.name}</h3>
                    <p>Cena: {product.price}</p>
                    <p>Data: {product.date}</p>
                    <p>Miejscowość: {product.location}</p>
                </div>
            </div>
        </Card>
    );
};

export default Product;
