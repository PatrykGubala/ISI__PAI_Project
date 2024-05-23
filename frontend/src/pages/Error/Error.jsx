import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Error = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { message } = location.state || {};

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Payment Error</h1>
            {message ? (
                <p>{message}</p>
            ) : (
                <p>An unknown error occurred.</p>
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

export default Error;
