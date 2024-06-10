import React, { useState, useEffect } from 'react';
import { Button, Input, Form, message, Menu, Dropdown } from 'antd';
import axiosInstance from '../Interceptors/axiosInstance';
import { useNavigate } from 'react-router-dom';
import './AddAdvertisement.css';
import Header from '../../components/Header/Header';

const { SubMenu } = Menu;

const AddAdvertisement = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Select a category');
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
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

    const buildMenu = (categories, parentId = null) => {
        return categories
            .filter(category => category.parentCategoryId === parentId)
            .map(category => {
                const subCategories = categories.filter(subCat => subCat.parentCategoryId === category.id);
                if (subCategories.length > 0) {
                    return (
                        <SubMenu key={category.id} title={category.name}>
                            {buildMenu(categories, category.id)}
                        </SubMenu>
                    );
                }
                return <Menu.Item key={category.id}>{category.name}</Menu.Item>;
            });
    };

    const handleMenuClick = ({ key }) => {
        const selectedCategory = categories.find(category => category.id === key);
        setSelectedCategory(selectedCategory.name);
        setSelectedCategoryId(selectedCategory.id);
        form.setFieldsValue({ categoryId: selectedCategory.id });
    };

    const handleSubmit = async (formData) => {
        setLoading(true);

        const queryParameters = `name=${encodeURIComponent(formData.name)}&description=${encodeURIComponent(formData.description)}&price=${formData.price}&categoryId=${selectedCategoryId}`;
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
                categoryId: selectedCategoryId
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

    const menu = (
        <Menu onClick={handleMenuClick}>
            {buildMenu(categories)}
        </Menu>
    );

    return (
        <div className="add-advertisement-container">
            <Header />
            <Form form={form} onFinish={handleSubmit} initialValues={{ name: '', description: '', price: '' }}>
                <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Please enter the name' }]} className="form-item">
                    <Input className="input-field" />
                </Form.Item>
                <Form.Item label="Description" name="description" rules={[{ required: true, message: 'Please enter a description' }]} className="form-item">
                    <Input.TextArea className="input-field" />
                </Form.Item>
                <Form.Item label="Price" name="price" rules={[{ required: true, message: 'Please enter a price' }]} className="form-item">
                    <Input type="number" className="input-field" />
                </Form.Item>
                <Form.Item label="Category" name="categoryId" rules={[{ required: true, message: 'Please select a category' }]} className="form-item">
                    <Dropdown overlay={menu} trigger={['click']}>
                        <Button className="category-select-button">
                            {selectedCategory}
                        </Button>
                    </Dropdown>
                </Form.Item>
                <Form.Item label="Images" name="images" className="form-item">
                    <Input type="file" multiple onChange={(event) => setFileList([...event.target.files])} className="input-field" />
                </Form.Item>
                <Form.Item className="">
                    <Button type="primary" htmlType="submit" loading={loading} className="submit-button">Add Advertisement</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddAdvertisement;
