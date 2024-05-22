import React, { useState, useEffect } from 'react';
import { Button, Input, Form, message } from 'antd';
import axiosInstance from '../Interceptors/axiosInstance';
import { useNavigate } from 'react-router-dom';
import './AddCategory.css';
import Header from '../../components/Header/Header';

const AddCategory = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const handleSubmit = async (formData) => {
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);

        try {
            const response = await axiosInstance.post('/admin/addCategory', data, {
            });
            message.success('Kategoria dodana pomyślnie');
            navigate('/');
        } catch (error) {
            console.error('Błąd podczas dodawania:', error);
            message.error('Nie udało się dodać kategorii');
        }
    };

    return (
        <div className="add-category-container">
            <Header />
            <Form
                form={form}
                onFinish={handleSubmit}
                initialValues={{
                    name: '',
                    description: '',
                }}
            >
                <Form.Item
                    label="Nazwa"
                    name="name"
                    rules={[{ required: true, message: 'Proszę wprowadzić nazwę' }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Opis"
                    name="description"
                    rules={[{ required: true, message: 'Proszę wprowadzić opis' }]}
                >
                    <Input.TextArea />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Dodaj Kategorie
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddCategory;
