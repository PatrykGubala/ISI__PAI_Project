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
    const [form] = Form.useForm();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axiosInstance.get('/categories');
                setCategories(response.data);
            } catch (error) {
                console.error('Błąd przy pobieraniu kategorii:', error);
            }
        };
        fetchCategories();
    }, []);

    const handleFileChange = event => {
        setFileList([...event.target.files]);
    };

    const handleSubmit = async (formData) => {
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('categoryId', formData.categoryId);

        fileList.forEach(file => {
            data.append('images', file);
        });

        try {
            const response = await axiosInstance.post('/user/addProductWithImage', data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            message.success('Ogłoszenie dodane pomyślnie');
            navigate('/');
        } catch (error) {
            console.error('Błąd podczas dodawania:', error);
            message.error('Nie udało się dodać ogłoszenia');
        }
    };

    return (
        
        <div className="add-advertisement-container">
             <Header />
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
                <Form.Item
                    label="Cena"
                    name="price"
                    rules={[{ required: true, message: 'Proszę wprowadzić cenę' }]}
                >
                    <Input type="number" />
                </Form.Item>
                <Form.Item
                    label="Kategoria"
                    name="categoryId"
                    rules={[{ required: true, message: 'Proszę wybrać kategorię' }]}
                >
                    <Select placeholder="Wybierz kategorię">
                        {categories.map(category => (
                            <Option key={category.categoryId} value={category.categoryId}>
                                {category.name}
                            </Option>
                        ))}
                    </Select>
                </Form.Item>
                <Form.Item
                    label="Zdjęcia"
                    name="images"
                >
                    <Input type="file" multiple onChange={handleFileChange} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Dodaj ogłoszenie
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddAdvertisement;
