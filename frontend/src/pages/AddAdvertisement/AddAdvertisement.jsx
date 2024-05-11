// src/pages/AddAdvertisement/AddAdvertisement.js
import React, { useState, useEffect } from 'react';
import './AddAdvertisement.css';
import { Button, Input, Form, message, Select } from 'antd';
import axiosInstance from '../Interceptors/axiosInstance';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;
const AddAdvertisement = () => {
    const [categories, setCategories] = useState([]);
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (formData) => {
        try {
            const response = await axiosInstance.post(`/user/addProduct?categoryId=${formData.categoryId}`, formData);
            message.success('Advertisement added successfully');
            navigate('/');
        } catch (error) {
            console.error('Error during adding:', error);
            message.error(error.message || 'Failed to add advertisement');
        }
    };

    return (
        <div className="add-advertisement-container">
            <Form
                form={form}
                onFinish={handleSubmit}
                initialValues={{
                    name: '',
                    description: '',
                    price: '',
                    categoryId: '',
                }}
            >
                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter the name',
                        },
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter the description',
                        },
                    ]}
                >
                    <Input.TextArea />
                </Form.Item>
                <Form.Item
                    label="Price"
                    name="price"
                    rules={[
                        {
                            required: true,
                            message: 'Please enter the price',
                        },
                    ]}
                >
                    <Input type="number" />
                </Form.Item>
                <Form.Item
                    label="Category"
                    name="categoryId"
                    rules={[
                        {
                            required: true,
                            message: 'Please select the category',
                        },
                    ]}
                >
                    <Select>
                        {categories.map((category) => (
                            <Option key={category.categoryId} value={category.categoryId}>
                                {category.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add Advertisement
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddAdvertisement;
