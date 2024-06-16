import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import axios from 'axios';

const PayPalCheckoutButton = ({ amount, clientID, orderRequest }) => {
    const [orderID, setOrderID] = useState(null);

    const createOrderBackend = async () => {
        try {
            const response = await axios.post('http://localhost:8080/orders', orderRequest);
            console.log('Order created:', response.data);
        } catch (error) {
            console.error('Error creating order:', error.message);
        }
    };

    return (
        <PayPalScriptProvider options={{ "client-id": clientID }}>
            <PayPalButtons
                createOrder={(data, actions) => {
                    return actions.order.create({
                        purchase_units: [{
                            amount: {
                                value: amount.toString(),
                            },
                        }],
                    });
                }}
                onApprove={async (data, actions) => {
                    try {
                        const details = await actions.order.capture();
                        console.log('Payment approved: ', details);

                        const updatedOrderRequest = {
                            ...orderRequest,
                            status: 'PAID'
                        };

                        await createOrderBackend(updatedOrderRequest);
                    } catch (error) {
                        console.error('Error approving payment:', error.message);
                    }
                }}
            />
        </PayPalScriptProvider>
    );
};

export default PayPalCheckoutButton;
