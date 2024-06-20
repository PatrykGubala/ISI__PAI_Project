import React from 'react';
import { Link } from 'react-router-dom';

const SuccessPage = () => {
    return (
        <div>
            <h2>Payment Successful!</h2>
            <p>Thank you for your purchase.</p>
            <Link to="/">Back to Home</Link>
        </div>
    );
};

export default SuccessPage;
