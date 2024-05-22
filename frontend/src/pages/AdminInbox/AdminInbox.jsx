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
                const response = await axiosInstance.get('/messages');
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

    const handleDelete = async (id) => {
        try {
            await axiosInstance.delete(`/messages/${id}`);
            setMessages((prevMessages) => prevMessages.filter((message) => message.messageId !== id));
            message.success('Wiadomość usunięta pomyślnie');
        } catch (error) {
            console.error('Błąd podczas usuwania wiadomości:', error);
            message.error('Nie udało się usunąć wiadomości');
        }
    };

    const columns = [
        {
            title: 'Imię',
            dataIndex: 'firstname',
            key: 'firstname',
        },
        {
            title: 'Nazwisko',
            dataIndex: 'lastName',
            key: 'lastName',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Temat',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: 'Wiadomość',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Akcje',
            key: 'actions',
            render: (_, record) => (
                <Button type="danger" onClick={() => handleDelete(record.messageId)}>
                    Usuń
                </Button>
            ),
        },
    ];

    return (
        <div className="admin-inbox-container">
            <Header />
            <div className="admin-inbox-content">
                <h2>Skrzynka odbiorcza</h2>
                <Table
                    columns={columns}
                    dataSource={messages}
                    loading={loading}
                    rowKey="messageId"
                />
            </div>
        </div>
    );
};

export default AdminInbox;
