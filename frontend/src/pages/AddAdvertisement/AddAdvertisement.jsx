import React, { useState, useEffect } from 'react';
import { Button, Input, Form, message, Menu, Dropdown, Select } from 'antd';
import axiosInstance from '../Interceptors/axiosInstance';
import { useNavigate } from 'react-router-dom';
import './AddAdvertisement.css';
import Header from '../../components/Header/Header';

const { SubMenu } = Menu;
const { Option } = Select;

const AddAdvertisement = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Select a category');
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [categoryFields, setCategoryFields] = useState([]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get('/categories');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
            message.error('Failed to fetch categories');
        }
    };

    const fetchCategoryFields = async (categoryId) => {
        try {
            const response = await axiosInstance.get(`/categories/${categoryId}/fields`);
            setCategoryFields(response.data.map(field => ({
                ...field,
                value: field.fieldType === 'RANGE' ? [field.defaultRangeMin, field.defaultRangeMax] : field.defaultEnumValuesJson.split(',')[0]
            })));
        } catch (error) {
            console.error('Error fetching category fields:', error);
            message.error('Failed to fetch category fields');
        }
    };

    const handleMenuClick = ({ key }) => {
        const category = categories.find(c => c.id === key);
        setSelectedCategory(category.name);
        setSelectedCategoryId(category.id);
        form.setFieldsValue({ categoryId: category.id });
        fetchCategoryFields(category.id);
    };

    const renderField = (field) => {
        if (!field) return null;

        switch (field.fieldType) {
            case 'ENUM':
                return (
                    <Form.Item
                        key={field.name}
                        label={field.label || field.name}
                        name={field.name}
                        className="form-item"
                        rules={[{ required: true, message: `Please select ${field.label || field.name}` }]}
                    >
                        <Select className="category-select-button" placeholder={`Select ${field.label || ''}`}>
                            {field.defaultEnumValuesJson.split(',').map(value => (
                                <Option key={value} value={value}>{value}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                );
            case 'RANGE':
                return (
                    <Form.Item
                        key={field.name}
                        label={field.label || field.name}
                        name={field.name}
                        className="form-item"
                        rules={[{ required: true, message: `Please enter a value for ${field.label || field.name}` }]}
                    >
                        <Input type="number" className="input-field" placeholder={`Enter value between ${field.defaultRangeMin} and ${field.defaultRangeMax}`} />
                    </Form.Item>
                );
            default:
                return (
                    <Form.Item
                        key={field.name}
                        label={field.label || field.name}
                        name={field.name}
                        className="form-item"
                        rules={[{ required: true, message: `Please enter ${field.label || field.name}` }]}
                    >
                        <Input type="text" />
                    </Form.Item>
                );
        }
    };

    const handleSubmit = async (formData) => {
        setLoading(true);


        const queryParameters = `name=${encodeURIComponent(formData.name)}&description=${encodeURIComponent(formData.description)}&price=${formData.price}&categoryId=${selectedCategoryId}`;

        const endpoint = fileList.length > 0
            ? `/user/addProductWithImage`
            : `/user/addProduct`;

        const data = new FormData();
        if (fileList.length > 0) {
            fileList.forEach(file => data.append('images', file));
        }


        const productDetails = {
            name: formData.name,
            description: formData.description,
            price: formData.price,
            categoryId: selectedCategoryId,
            productAttributes: categoryFields.map(field => ({
                name: field.name,
                value: formData[field.name]
            }))
        };
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('categoryId', selectedCategoryId);
        data.append('productAttributes', JSON.stringify(productDetails.productAttributes));
        try {
            const response = await axiosInstance.post(endpoint, fileList.length > 0 ? data : productDetails, {
                headers: {
                    'Content-Type': fileList.length > 0 ? 'multipart/form-data' : 'application/json'
                }
            });

            if (response.status === 201) {
                message.success('Advertisement added successfully');
                form.resetFields();
                setCategoryFields([]);
                navigate('/');
            } else {
                throw new Error('Unexpected response status: ' + response.status);
            }
        } catch (error) {
            console.error('Error adding advertisement:', error);
            message.error(error.response?.data?.message || 'Failed to add advertisement');
        } finally {
            setLoading(false);
        }
    };

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

    const menu = (
        <Menu onClick={handleMenuClick}>
            {buildMenu(categories)}
        </Menu>
    );

    return (
        <div className="add-advertisement-container">
            <Header />
            <Form form={form} onFinish={handleSubmit} initialValues={{ name: '', description: '', price: '' }}>
                <Form.Item label="Nazwa" name="name" rules={[{ required: true, message: 'Please enter the name' }]} className="form-item">
                    <Input className="input-field" />
                </Form.Item>
                <Form.Item label="Opis" name="description" rules={[{ required: true, message: 'Please enter a description' }]} className="form-item">
                    <Input.TextArea className="input-field" />
                </Form.Item>
                <Form.Item label="Cena" name="price" rules={[{ required: true, message: 'Please enter a price' }]} className="form-item">
                    <Input type="number" className="input-field" />
                </Form.Item>
                <Form.Item label="Zdjęcia" name="images" className="form-item">
                    <Input type="file" multiple onChange={(event) => setFileList([...event.target.files])} className="input-field" />
                </Form.Item>
                <Form.Item label="Kategoria" name="categoryId" rules={[{ required: true, message: 'Please select a category' }]} className="form-item">
                    <Dropdown overlay={menu} trigger={['click']}>
                        <Button className="category-select-button">
                            {selectedCategory}
                        </Button>
                    </Dropdown>
                </Form.Item>
                {categoryFields.map(renderField)}
                <Form.Item className="">
                    <Button type="primary" htmlType="submit" loading={loading} className="submit-button">Dodaj ogłoszenie</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default AddAdvertisement;
