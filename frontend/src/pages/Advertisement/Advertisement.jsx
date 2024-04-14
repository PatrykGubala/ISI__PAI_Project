import React from 'react';
import './Advertisement.css';

const Advertisement = () => {
    return (
        <div className="advertisement">
            <div className="advertisement-left">
                <img src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Krowa.jpg" alt="Cow" />
            </div>
            <div className="advertisement-right">
                <div className="price">Cena: $1000</div>
                <div className="contact">Kontakt: +123456789</div>
            </div>
            <div className="description">
                <p>Piękna krowa, daje dużo mleka. Mało je, ekonomiczna w utrzymaniu.</p>
            </div>
        </div>
    );
}

export default Advertisement;
