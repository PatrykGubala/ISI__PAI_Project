import React, { useState } from 'react';
import './Search.css';

const Search = ({ onSearch }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onSearch(searchTerm);
    };

    return (
        <form className="search-form" onSubmit={handleSubmit}>
            <input
                className="search-input"
                type="text"
                placeholder="Znajdź coś dla siebie"
                value={searchTerm}
                onChange={handleChange}
            />
            <button className="search-button" type="submit">Szukaj</button>
        </form>
    );
};

export default Search;
