import React, { useState, useEffect } from 'react';
import { Button, Input, Form, message, Select } from 'antd';
import axiosInstance from '../Interceptors/axiosInstance';
import { useNavigate } from 'react-router-dom';
import './AddAdvertisement.css';
import Header from '../../components/Header/Header';

const { Option } = Select;

const AddAdvertisement = () => {
    const [categories, setCategories] = useState([]);
    const [fileList, setFileList] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Error fetching categories:', error);
                message.error('Failed to fetch categories');
            }
        };
        fetchCategories();
    }, []);

    const handleSubmit = async (formData) => {
        setLoading(true);

        const queryParameters = `name=${encodeURIComponent(formData.name)}&description=${encodeURIComponent(formData.description)}&price=${formData.price}&categoryId=${formData.categoryId}`;
        const endpoint = fileList.length > 0
            ? `/user/addProductWithImage?${queryParameters}`
            : `/user/addProduct?${queryParameters}`;

        const data = new FormData();
        if (fileList.length > 0) {
            fileList.forEach(file => data.append('images', file));
        }

        try {
            const config = {
                headers: {
                    'Content-Type': fileList.length > 0 ? 'multipart/form-data' : 'application/json'
                }
            };
            const response = await axiosInstance.post(endpoint, fileList.length > 0 ? data : JSON.stringify({
                name: formData.name,
                description: formData.description,
                price: formData.price,
                categoryId: formData.categoryId
            }), config);

            if (response.status === 201) {
                message.success('Advertisement added successfully');
                form.resetFields();
                setFileList([]);
                navigate('/');
            } else {
                throw new Error('Unexpected response status: ' + response.status);
            }
        } catch (error) {
            console.error('Error adding advertisement:', error);
            message.error(error.response?.data?.message || 'Failed to add advertisement');
            if (error.response?.status === 401) {
                navigate('/login');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="add-advertisement-container">
            <Header />
            <Form form={form} onFinish={handleSubmit} initialValues={{ name: '', description: '', price: '', categoryId: '' }}>
                <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Proszę wprowadzić nazwę' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Proszę wprowadzić opis' }]}>
                    <Input.TextArea />
                </Form.Item>
                <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Proszę wprowadzić cenę' }]}>
                    <Input type="number" />
                </Form.Item>
                <Form.Item label="Category" name="categoryId" rules={[{ required: true, message: 'Proszę wybrać kategorię' }]}>
                    <Select placeholder="Select a category">
                        {categories.map(category => <Option key={category.categoryId} value={category.categoryId}>{category.name}</Option>)}
                    </Select>
                </Form.Item>
                <Form.Item label="Images" name="images">
                    <Input type="file" multiple onChange={(event) => setFileList([...event.target.files])} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading}>Add Advertisement</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddAdvertisement;
