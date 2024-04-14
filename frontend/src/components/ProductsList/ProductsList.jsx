import React from 'react';
import { Link } from 'react-router-dom';
import './ProductsList.css';
import Offert from '../Offert/Offert';

const ProductsList = ({ o, categories, products }) => {
    return (
        <div className="products-list-wrapper">
            {o.map(product => (
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

            {products.map(product => (
                <div key={product.id}>
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                </div>
            ))}
        </div>
    );
};

export default ProductsList;
