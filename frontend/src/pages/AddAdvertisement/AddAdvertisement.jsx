import React, { useState, useEffect } from 'react';
import './AddAdvertisement.css';
import { Button, Input, Form, message, Select } from 'antd';
const { Option } = Select;
const API_BASE_URL = 'http://localhost:8080';
import {useNavigate} from "react-router-dom";
import axiosInstance from "../../hooks/Interceptor.jsx";


const AddAdvertisement = () => {
    const [categories, setCategories] = useState([]);
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const fetchCategories = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/categories`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };
    const token = localStorage.getItem('access_token');

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleSubmit = async (formData) => {
        try {
            console.log('Form Data:', formData);
            const response = await fetch(`${API_BASE_URL}/user/addProduct?categoryId=${formData.categoryId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });
            if (!response.ok) {
                console.error('Network response was not ok:', response.statusText);
                throw new Error('Network response was not ok');
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                console.log('successful:', data);
                message.success('Advertisement added successfully');
            } else {
                console.log('successful:', response.statusText);
                message.success('Advertisement added successfully');
            }
        } catch (error) {
            console.error('Error during adding:', error);
            message.error(error.message || 'Failed to add advertisement');
        }
        navigate("/");
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