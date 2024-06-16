import React from 'react';
import { Link } from 'react-router-dom';

const Cancel = () => {
    return (
        <div>
            <h2>Payment Cancelled</h2>
            <p>Your payment has been cancelled.</p>
            <Link to="/">Back to Home</Link>
        </div>
    );
};

export default Cancel;
