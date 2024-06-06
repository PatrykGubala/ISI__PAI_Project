import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Menu, Dropdown } from 'antd';
import './Filter.css';
import axiosInstance from '../../pages/Interceptors/axiosInstance.js';

const { SubMenu } = Menu;

const Filter = ({ handleFilter }) => {
    const [form] = Form.useForm();
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('Wybierz kategorie');

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
                const subCategories = categories.filter(subCat => subCat.parentCategoryId === category.categoryId);
                if (subCategories.length > 0) {
                    return (
                        <SubMenu key={category.categoryId} title={category.name}>
                            {buildMenu(categories, category.categoryId)}
                        </SubMenu>
                    );
                }
                return <Menu.Item key={category.categoryId}>{category.name}</Menu.Item>;
            });
    };

    const handleMenuClick = ({ key }) => {
        const selectedCategory = categories.find(category => category.categoryId === key);
        setSelectedCategory(selectedCategory.name);
        form.setFieldsValue({ category: selectedCategory.name });
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
            {buildMenu(categories)}
        </Menu>
    );

    const onFinish = (values) => {
        handleFilter(values);
    };

    return (
        <div className="filter-container">
            <Form
                form={form}
                layout="vertical"
                onFinish={onFinish}
            >
                <div className="row">
                    <div className="col">
                        <Form.Item label="Kategoria" name="category">
                            <Dropdown overlay={menu} trigger={['click']} className="custom-dropdown">
                                <Button className="custom-dropdown-btn">
                                    {selectedCategory}
                                </Button>
                            </Dropdown>
                        </Form.Item>
                    </div>

                    <div className="colPrice">
                        <Form.Item label="Cena od" name="priceFrom">
                            <Input placeholder="Od" />
                        </Form.Item>
                    </div>

                    <div className="colPrice">
                        <Form.Item label="Cena do" name="priceTo">
                            <Input placeholder="Do" />
                        </Form.Item>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <Form.Item label="Miejscowość" name="location">
                            <Input placeholder="Wpisz miejscowość" />
                        </Form.Item>
                    </div>
                </div>

                <div className="row">
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Filtruj</Button>
                    </Form.Item>
                </div>
            </Form>
        </div>
    );
};

export default Filter;
