import React from 'react';
import { Link } from 'react-router-dom';
import './ProductsList.css';
import Offert from '../Offert/Offert';

const ProductsList = ({ categories, products }) => {
    return (
        <div className="products-list-wrapper">
            {products.map(product => (
                <Link to={`/advertisement/${product.id}`} key={product.id}>
                    <Offert product={product} />
                </Link>
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

export default ProductsList;
