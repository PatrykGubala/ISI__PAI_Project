import React from 'react';
import { Link } from 'react-router-dom';
import './ProfileProductsList.css';
import ProfileOffert from "../ProfileOffert/ProfileOffert.jsx";

const ProfileProductsList = ({ categories, products, onDelete }) => {
    return (
        <div className="products-list-wrapper">
            {products.map(product => (
                     <ProfileOffert key={product.id} product={product} onDelete={onDelete} />
            ))}

            {categories.map(category => (
                <div key={category.categoryId}>
                    <h3>{category.name}</h3>
                    <p>{category.description}</p>
                </div>
            ))}
        </div>
    );
};

export default ProfileProductsList;
