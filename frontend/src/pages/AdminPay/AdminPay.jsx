import React, { useState, useEffect } from 'react';
import { Layout, Typography, Spin, Table, Button, message } from 'antd';
import axiosInstance from '../Interceptors/axiosInstance';
import Header from '../../components/Header/Header';
import './AdminPay.css';

const { Content: AntContent } = Layout;
const { Title } = Typography;

const AdminPay = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const username = localStorage.getItem('username');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axiosInstance.get('/orders');
                setOrders(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrders();
    }, [username]);

    const updateOrderStatus = async (orderId, status) => {
        try {
            await axiosInstance.patch(`/orders/${orderId}?status=${status}`);
            message.success('Order status updated successfully');
            setOrders((prevOrders) =>
                prevOrders.map((order) =>
                    order.id === orderId ? { ...order, status } : order
                )
            );
        } catch (error) {
            console.error('Error updating order status:', error);
            message.error('Failed to update order status');
        }
    };

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
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="primary"
                    onClick={() => updateOrderStatus(record.id, 'PAID')}
                    disabled={record.status === 'PAID'}
                >
                    Mark as PAID
                </Button>
            ),
        },
    ];

    if (loading) {
        return (
            <div className="loading">
                <Spin size="large" />
            </div>
        );
    }

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
