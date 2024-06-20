import React from 'react';
import {Card, Image} from 'antd';
import './Offert.css';

const Product = ({ product }) => {
    return (
        <Card className="product-card" hoverable>
            <div className="product-info">
                <div className="product-image">
                    <Image
                        width={150}
                        height={150}
                        src={product.images.length > 0 ? product.images[0].imageUrl : 'placeholder.jpg'}
                        alt={product.name}
                        className="product-image"
                    />
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
