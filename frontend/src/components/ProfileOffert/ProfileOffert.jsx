import React from 'react';
import { Card, Image, Button } from 'antd';
import './ProfileOffert.css';

const ProfileOffert = ({ product, onDelete }) => {
    const handleDelete = () => {
        onDelete(product.id);
    };

    return (
        <Card className="product-card" hoverable>
            <div className="product-info">
                <div className="product-image">
                    <Image
                        width={200}
                        height={200}
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
                    <Button type="danger" onClick={handleDelete}>Usuń ofertę</Button>
                </div>
            </div>
        </Card>
    );
};

export default ProfileOffert;
