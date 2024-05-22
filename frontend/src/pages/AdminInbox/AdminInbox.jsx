import React, { useState, useEffect } from 'react';
import { Table, Button, message } from 'antd';
import axiosInstance from '../Interceptors/axiosInstance';
import './AdminInbox.css';
import Header from '../../components/Header/Header';

const AdminInbox = () => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await axiosInstance.get('/admin/contactMessages');
                setMessages(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Błąd przy pobieraniu wiadomości:', error);
                message.error('Nie udało się pobrać wiadomości');
                setLoading(false);
            }
        };

        fetchMessages();
    }, []);

    const columns = [
        {
            title: 'Imię',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Temat',
            dataIndex: 'subject',
            key: 'subject',
        },
        {
            title: 'Wiadomość',
            dataIndex: 'message',
            key: 'message',
        },
        {
            title: 'Akcje',
            key: 'actions',
            render: (_, record) => (
                <Button type="danger" onClick={() => handleDelete(record.id)}>
                    Usuń
                </Button>
            ),
        },
    ];

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/admin/contactMessages/${id}`);
            setMessages((prevMessages) => prevMessages.filter((message) => message.id !== id));
            message.success('Wiadomość usunięta pomyślnie');
        } catch (error) {
            console.error('Błąd podczas usuwania wiadomości:', error);
            message.error('Nie udało się usunąć wiadomości');
        }
    };

    return (
        <div className="admin-inbox-container">
            <Header />
            <div className="admin-inbox-content">
                <h2>Skrzynka odbiorcza</h2>
                <Table
                    columns={columns}
                    dataSource={messages}
                    loading={loading}
                    rowKey="id"
                />
            </div>
        </div>
    );
};

export default AdminInbox;
