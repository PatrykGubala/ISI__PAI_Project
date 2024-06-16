import React, { useState, useEffect } from 'react';
import { Layout, Typography, Spin, Table } from 'antd';
import axiosInstance from '../Interceptors/axiosInstance';
import Header from '../../components/Header/Header';

const { Content: AntContent } = Layout;
const { Title } = Typography;

const AdminPay = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const username = localStorage.getItem('username');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                let response;

                response = await axiosInstance.get('/orders');
                setOrders(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, [username]);

    if (loading) {
        return (
            <div className="loading">
                <Spin size="large" />
            </div>
        );
    }

    const columns = [
        {
            title: 'Order ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Order Date',
            dataIndex: 'orderDate',
            key: 'orderDate',
        },
        {
            title: 'User',
            dataIndex: ['user', 'username'],
            key: 'user',
        },
        {
            title: 'Product',
            dataIndex: ['product', 'name'],
            key: 'product',
        },

    ];

    return (
        <Layout>
            <Header />
            <AntContent>
                <div className="orders-page">
                    <div className="orders-header">
                        <Title level={2}>Orders Management</Title>
                    </div>
                    <Table dataSource={orders} columns={columns} rowKey="id" />
                </div>
            </AntContent>
        </Layout>
    );
};

export default AdminPay;
