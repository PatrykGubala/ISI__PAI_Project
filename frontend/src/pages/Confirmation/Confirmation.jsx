import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Confirmation= () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { paymentDetails } = location.state || {};

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Payment Successful</h1>
            {paymentDetails ? (
                <div>
                    <p><strong>Payment ID:</strong> {paymentDetails.id}</p>
                    <p><strong>Payment Status:</strong> {paymentDetails.state}</p>
                    <p><strong>Payer Email:</strong> {paymentDetails.payer.payer_info.email}</p>
                    <p><strong>Transaction Amount:</strong> {paymentDetails.transactions[0].amount.total} {paymentDetails.transactions[0].amount.currency}</p>
                </div>
            ) : (
                <p>No payment details available.</p>
            )}
            <button
                onClick={() => navigate('/')}
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    fontSize: '16px',
                    cursor: 'pointer'
                }}
            >
                Go to Home
            </button>
        </div>
    );
};

export default Confirmation;
