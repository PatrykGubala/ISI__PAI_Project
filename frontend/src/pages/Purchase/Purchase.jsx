import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Input, Form, Checkbox } from 'antd';
import Header from '../../components/Header/Header.jsx';
import axiosInstance from '../Interceptors/axiosInstance';
import './Purchase.css';
import PayPalCheckoutButton from "../../components/PayPalCheckoutButton/PayPalCheckoutButton.jsx";

const Purchase = () => {
    const { id } = useParams();
    const [advertisementData, setAdvertisementData] = useState(null);
    const [userData, setUserData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phoneNumber: '',
        postalCode: '',
        city: '',
        street: ''
    });
    const [invoiceData, setInvoiceData] = useState({
        companyName: '',
        taxId: '',
        invoicePostalCode: '',
        invoiceCity: '',
        invoiceStreet: ''
    });
    const [selectedShipping, setSelectedShipping] = useState('');
    const [shippingCost, setShippingCost] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [showInvoiceFields, setShowInvoiceFields] = useState(false);
    const serviceCost = 5;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const productResponse = await axiosInstance.get(`/products/${id}`);
                setAdvertisementData(productResponse.data);
                setTotalPrice(productResponse.data.price + serviceCost + shippingCost);

                const userResponse = await axiosInstance.get('/user/profile');
                setUserData({
                    ...userResponse.data,
                    postalCode: '',
                    city: '',
                    street: ''
                });
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [id]);

    const handleShippingChange = (shippingMethod, shippingCost) => {
        setSelectedShipping(shippingMethod);
        setShippingCost(shippingCost);
        setTotalPrice(advertisementData.price + shippingCost + serviceCost);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleInvoiceInputChange = (e) => {
        const { name, value } = e.target;
        setInvoiceData({ ...invoiceData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        setShowInvoiceFields(e.target.checked);
    };

    const handleNavigation = () => {
        navigate('./../../TransferInfo');
    };

    const createOrder = async () => {
        try {
            const orderRequest = {
                userId: userData.userId,
                productId: id,
                paymentMethod: 'Transfer',
                deliveryAddress: `${userData.street}, ${userData.city}, ${userData.postalCode}`,
                price: totalPrice.toString(),
                status: 'UNPAID'
            };

            const response = await axiosInstance.post('/orders', orderRequest);
            console.log('Order created:', response.data);

            handleNavigation();
        } catch (error) {
            console.error('Error creating order:', error);
        }
    };

    if (!advertisementData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Header />

            <div className="row-boards">
                <div className="purchase-left">
                    <div className="title">Wybierz sposób dostawy</div>
                    <div
                        className={`shipping-card ${selectedShipping === 'InPost' ? 'selected' : ''}`}
                        onClick={() => handleShippingChange('InPost', 15)}
                    >
                        <div className="shipping-info">
                            <div className="shipping-price">
                                <h3>Paczkomat InPost</h3>
                                <p>15 USD</p>
                            </div>
                        </div>
                    </div>
                    <div
                        className={`shipping-card ${selectedShipping === 'DPD' ? 'selected' : ''}`}
                        onClick={() => handleShippingChange('DPD', 25)}
                    >
                        <div className="shipping-info">
                            <div className="shipping-price">
                                <h3>Kurier DPD</h3>
                                <p>25 USD</p>
                            </div>
                        </div>
                    </div>
                    <div
                        className={`shipping-card ${selectedShipping === 'DHL' ? 'selected' : ''}`}
                        onClick={() => handleShippingChange('DHL', 20)}
                    >
                        <div className="shipping-info">
                            <div className="shipping-price">
                                <h3>Kurier DHL</h3>
                                <p>20 USD</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="purchase-mid">
                    <div className="title">Uzupełnij swoje dane</div>
                    <Form layout="vertical">
                        <Form.Item label="Imię">
                            <Input
                                name="firstName"
                                value={userData.firstName}
                                onChange={handleInputChange}
                            />
                        </Form.Item>
                        <Form.Item label="Nazwisko">
                            <Input
                                name="lastName"
                                value={userData.lastName}
                                onChange={handleInputChange}
                            />
                        </Form.Item>
                        <Form.Item label="Email">
                            <Input
                                name="email"
                                value={userData.email}
                                onChange={handleInputChange}
                            />
                        </Form.Item>
                        <Form.Item label="Numer telefonu">
                            <Input
                                name="phoneNumber"
                                value={userData.phoneNumber}
                                onChange={handleInputChange}
                            />
                        </Form.Item>
                        <Form.Item label="Kod pocztowy">
                            <Input
                                name="postalCode"
                                placeholder="Wpisz kod pocztowy"
                                value={userData.postalCode}
                                onChange={handleInputChange}
                            />
                        </Form.Item>
                        <Form.Item label="Miasto">
                            <Input
                                name="city"
                                placeholder="Wpisz miasto"
                                value={userData.city}
                                onChange={handleInputChange}
                            />
                        </Form.Item>
                        <Form.Item label="Ulica">
                            <Input
                                name="street"
                                placeholder="Wpisz ulicę"
                                value={userData.street}
                                onChange={handleInputChange}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Checkbox onChange={handleCheckboxChange}>
                                Czy chcesz otrzymać fakturę?
                            </Checkbox>
                        </Form.Item>
                        {showInvoiceFields && (
                            <>
                                <Form.Item label="Nazwa firmy">
                                    <Input
                                        name="companyName"
                                        placeholder="Wpisz nazwę firmy"
                                        value={invoiceData.companyName}
                                        onChange={handleInvoiceInputChange}
                                    />
                                </Form.Item>
                                <Form.Item label="NIP">
                                    <Input
                                        name="taxId"
                                        placeholder="Wpisz NIP"
                                        value={invoiceData.taxId}
                                        onChange={handleInvoiceInputChange}
                                    />
                                </Form.Item>
                                <Form.Item label="Kod pocztowy (faktura)">
                                    <Input
                                        name="invoicePostalCode"
                                        placeholder="Wpisz kod pocztowy"
                                        value={invoiceData.invoicePostalCode}
                                        onChange={handleInvoiceInputChange}
                                    />
                                </Form.Item>
                                <Form.Item label="Miasto (faktura)">
                                    <Input
                                        name="invoiceCity"
                                        placeholder="Wpisz miasto"
                                        value={invoiceData.invoiceCity}
                                        onChange={handleInvoiceInputChange}
                                    />
                                </Form.Item>
                                <Form.Item label="Ulica (faktura)">
                                    <Input
                                        name="invoiceStreet"
                                        placeholder="Wpisz ulicę"
                                        value={invoiceData.invoiceStreet}
                                        onChange={handleInvoiceInputChange}
                                    />
                                </Form.Item>
                            </>
                        )}
                    </Form>
                </div>

                <div className="purchase-right">
                    <Card className="product-card" hoverable>
                        <div className="product-info">

                            <div className="product-details">
                                <h3>{advertisementData.name}</h3>
                                <p>Cena: {advertisementData.price} USD</p>
                            </div>
                        </div>
                    </Card>
                    <div className="part-price">Produkt: {advertisementData.price} USD</div>
                    {selectedShipping && (
                        <div className="part-price">Dostawa: {shippingCost} USD</div>
                    )}
                    <div className="part-price">Opłata serwisowa: {serviceCost} USD</div>
                    <div className="total-price">Całkowita kwota: {totalPrice} USD</div>
                    <PayPalCheckoutButton
                        amount={totalPrice}
                        clientID={'ASRGeFLIV4kKWUSHrn5bA4Ozf7hnp9zVzi7TGqxv5Jacwjjv8ltlNBYMeR43MaGbzoEoeihAEPr5R5j0'}
                        orderRequest={{
                            userId: userData.userId,
                            productId: id,
                            paymentMethod: 'PayPal',
                            deliveryAddress: `${userData.street}, ${userData.city}, ${userData.postalCode}`,
                            price: totalPrice.toString(),
                            status: 'PAID'
                        }}
                        productId={id}
                    />
                    <Button type="primary" onClick={createOrder}>
                        Zapłać przelewem
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default Purchase;
