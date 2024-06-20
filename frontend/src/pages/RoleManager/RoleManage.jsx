import './RoleManage.css';
import React, { useState, useEffect } from 'react';
import { Table, Typography, Image, Input, Button, Spin, Card, Tabs, Pagination, Select, message } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import Header from '../../components/Header/Header';
import axiosInstance from '../Interceptors/axiosInstance';

const { Option } = Select;

const RoleManage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRoles, setSelectedRoles] = useState({});
    const [selectId, setId] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axiosInstance.get('/admin/users');
                const validUsers = response.data.filter(user => user.email); 
                setUsers(validUsers);
            } catch (error) {
                console.error('Failed to fetch users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const updateRole = async (userId, newRole) => {
        try {
            console.log(`Próba aktualizacji roli dla użytkownika o ID: ${userId}, nowa rola: ${newRole}`);
            await axiosInstance.put(`/admin/users/${userId}/role`, { role: newRole });
            message.success('Rola użytkownika została zaktualizowana.');
            setUsers(users.map(user => user.userId === userId ? { ...user, role: newRole } : user));
        } catch (error) {
            message.error('Aktualizacja roli nie powiodła się.');
            console.error('Failed to update user role:', error);
        }
    }

    const handleRoleChange = (userId, newRole) => {
        setSelectedRoles(prevState => ({ ...prevState, [userId]: newRole }));
        setId(userId); // Set the selected user ID
    };

    const columns = [
        {
            title: 'Imie',
            dataIndex: 'firstName',
            key: 'firstName',
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
            title: 'Rola',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Zmień Role',
            key: 'changeRole',
            render: (_, record) => (
                <Select
                    defaultValue={record.role}
                    onChange={(newRole) => handleRoleChange(record.id, newRole)}
                >
                    <Option value="USER">USER</Option>
                    <Option value="ADMIN">ADMIN</Option>
                    <Option value="USER2">USER2</Option>
                </Select>
            ),
        },
        {
            title: 'Akcje',
            key: 'actions',
            render: (_, record) => (
                <Button
                    type="primary"
                    onClick={() => {
                        const newRole = selectedRoles[record.id];
                        if (newRole && selectId === record.id) {
                            updateRole(record.userId, newRole); // Pass the correct userId and newRole
                        } else {
                            message.warning('Wybierz nową rolę przed aktualizacją.');
                        }
                    }}
                >
                    Zmień uprawnienia
                </Button>
            ),
        },
    ];

    return (
        <div className="admin-inbox-container">
            <Header />
            <div className="admin-inbox-content">
                <h2>Użytkownicy</h2>
                <Table
                    columns={columns}
                    dataSource={users}
                    rowKey="id"
                    loading={loading}
                />
            </div>
        </div>
    );
};

export default RoleManage;