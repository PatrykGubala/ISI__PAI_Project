import React, { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const PayPalCheckoutButton = ({ amount, clientID, orderRequest, productId }) => {
    const [orderID, setOrderID] = useState(null);
    const navigate = useNavigate();


    const createOrderBackend = async (updatedOrderRequest) => {
        try {
            const response = await axios.post('http://localhost:8080/orders', updatedOrderRequest);
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
                        navigate("/success");

                    } catch (error) {
                        console.error('Error approving payment:', error.message);
                        navigate("/cancel");

                    }
                }}
            />
        </PayPalScriptProvider>
    );
};

export default PayPalCheckoutButton;
