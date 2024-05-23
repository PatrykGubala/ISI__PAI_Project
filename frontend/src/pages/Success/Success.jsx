import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Success = () => {
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const paymentId = params.get('paymentId');
        const payerId = params.get('PayerID');

        if (paymentId && payerId) {
            fetch(`http://localhost:8080/api/paypal/success?paymentId=${paymentId}&PayerID=${payerId}`, {
                method: 'GET',
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error executing payment');
                    }
                    return response.json();
                })
                .then(data => {
                    console.log('Payment approved:', data);
                    navigate('/confirmation', { state: { paymentDetails: data } });
                })
                .catch(error => {
                    console.error('Error approving payment:', error.message);
                    navigate('/error', { state: { message: error.message } });
                });
        }
    }, [location, navigate]);

    return (
        <div>
            <h1>Processing Payment...</h1>
        </div>
    );
};

export default Success;
