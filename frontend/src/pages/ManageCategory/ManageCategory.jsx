import React, { useState, useEffect } from 'react';
import { Button, Input, Form, message, Select } from 'antd';
import axiosInstance from '../Interceptors/axiosInstance';
import { useNavigate } from 'react-router-dom';
import './ManageCategory.css';
import Header from '../../components/Header/Header';

const { Option } = Select;

const ManageCategory = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [isCategory, setIsCategory] = useState(true);

    const handleSelectChange = (value) => {
        setIsCategory(value === 'category');
    };

    useEffect(() => {
        handleSelectChange('category');
    }, []);
    const handleSubmit = async (formData) => {
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);

        const url = isCategory ? '/admin/addCategory' : '/admin/addSubcategory';

        try {
            await axiosInstance.post(url, data);
            message.success(isCategory ? 'Kategoria dodana pomyślnie' : 'Podkategoria dodana pomyślnie');
            navigate('/');
        } catch (error) {
            console.error('Błąd podczas dodawania:', error);
            message.error(isCategory ? 'Nie udało się dodać kategorii' : 'Nie udało się dodać podkategorii');
        }
    };

    return (
        <div className="manage-category-container">
            <Header />
            <Form
                form={form}
                onFinish={handleSubmit}
                initialValues={{
                    type: 'category',
                    name: '',
                    description: '',
                }}
            >
                <Form.Item
                    label="Typ"
                    name="type"
                    rules={[{ required: true, message: 'Proszę wybrać typ' }]}
                >
                    <Select defaultValue="category" onChange={handleSelectChange}>
                        <Option value="category">Kategoria</Option>
                        <Option value="subcategory">Podkategoria</Option>
                    </Select>
                </Form.Item>
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
                        {isCategory ? 'Dodaj Kategorię' : 'Dodaj Podkategorię'}
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ManageCategory;
