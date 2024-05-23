import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const PayPalCheckoutButton = ({ amount, clientID }) => {
    const [orderID, setOrderID] = useState(null);

    const createOrder = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/paypal/pay', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ price: amount }),
            });

            if (!response.ok) {
                throw new Error('Error creating order');
            }

            const approvalUrl = await response.text();
            window.location.href = approvalUrl;
        } catch (error) {
            console.error('Error creating order:', error.message);
        }
    };

    const onApprove = async (data, actions) => {
        try {
            const response = await fetch(`http://localhost:8080/api/paypal/success?paymentId=${data.paymentID}&PayerID=${data.payerID}`, {
                method: 'GET',
            });

            if (!response.ok) {
                throw new Error('Error approving payment');
            }

            const details = await response.json();
            console.log('Payment approved: ', details);
        } catch (error) {
            console.error('Error approving payment:', error.message);
        }
    };

    return (
        <PayPalScriptProvider options={{ "client-id": clientID }}>
            <PayPalButtons
                createOrder={(data, actions) => {
                    return createOrder();
                }}
                onApprove={(data, actions) => {
                    return onApprove(data, actions);
                }}
            />
        </PayPalScriptProvider>
    );
};

export default PayPalCheckoutButton;
