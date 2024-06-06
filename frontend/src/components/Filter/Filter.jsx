import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Menu, Dropdown, Slider, Select } from 'antd';
import './Filter.css';
import axiosInstance from '../../pages/Interceptors/axiosInstance.js';

const { SubMenu } = Menu;
const { Option } = Select;

const Filter = ({ handleFilter }) => {
    const [form] = Form.useForm();
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('Wybierz kategorie');
    const [categoryFields, setCategoryFields] = useState([]);
    const [breadcrumb, setBreadcrumb] = useState([]);

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
                        <SubMenu key={category.categoryId} title={category.name} onTitleClick={() => handleMenuClick({ key: category.categoryId })}>
                            {buildMenu(categories, category.categoryId)}
                        </SubMenu>
                    );
                }
                return <Menu.Item key={category.categoryId}>{category.name}</Menu.Item>;
            });
    };

    const handleMenuClick = async ({ key }) => {
        const selectedCategory = categories.find(category => category.categoryId === key);
        setSelectedCategory(selectedCategory.name);
        form.setFieldsValue({ category: selectedCategory.name });

        setBreadcrumb(prev => [...prev, selectedCategory.name]);

        try {
            const response = await axiosInstance.get(`/categories/${key}/fields`);
            setCategoryFields(response.data);
        } catch (error) {
            console.error('Error fetching category fields:', error);
            message.error('Failed to fetch category fields');
        }
    };

    const handleBreadcrumbClick = (index) => {
        const newBreadcrumb = breadcrumb.slice(0, index + 1);
        setBreadcrumb(newBreadcrumb);
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
            {buildMenu(categories)}
        </Menu>
    );

    const renderField = (field) => {
        switch (field.fieldType) {
            case 'STRING':
                return (
                    <Form.Item key={field.name} label={field.name} name={field.name} className="full-width">
                        <Input placeholder={`Wpisz ${field.name}`} />
                    </Form.Item>
                );
            case 'INTEGER':
                return (
                    <Form.Item key={field.name} label={field.name} name={field.name} className="full-width">
                        <Input type="number" placeholder={`Wpisz ${field.name}`} />
                    </Form.Item>
                );
            case 'RANGE':
                return (
                    <Form.Item key={field.name} label={field.name} name={field.name} className="full-width">
                        <Slider
                            range
                            min={field.defaultRangeMin}
                            max={field.defaultRangeMax}
                            defaultValue={[field.defaultRangeMin, field.defaultRangeMax]}
                        />
                    </Form.Item>
                );
            case 'ENUM':
                return (
                    <Form.Item key={field.name} label={field.name} name={field.name} className="full-width">
                        <Select mode="multiple" placeholder={`Wybierz ${field.name}`}>
                            {field.defaultEnumValuesJson && field.defaultEnumValuesJson.split(',').map(value => (
                                <Option key={value} value={value}>{value}</Option>
                            ))}
                        </Select>
                    </Form.Item>
                );
            default:
                return null;
        }
    };

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
                    <Form.Item label="Kategoria" name="category" className="full-width">
                        <Dropdown overlay={menu} trigger={['click']} className="custom-dropdown">
                            <Button className="custom-dropdown-btn">
                                {selectedCategory}
                            </Button>
                        </Dropdown>
                    </Form.Item>

                    <Form.Item label="Cena od" name="priceFrom" className="full-width">
                        <Input placeholder="Od" />
                    </Form.Item>

                    <Form.Item label="Cena do" name="priceTo" className="full-width">
                        <Input placeholder="Do" />
                    </Form.Item>

                    {categoryFields.map(renderField)}
                </div>

                <div className="row">
                    <Form.Item className="full-width">
                        <Button type="primary" htmlType="submit">Filtruj</Button>
                    </Form.Item>
                </div>
            </Form>
            {breadcrumb.length > 0 && (
                <div className="breadcrumb">
                    {breadcrumb.map((crumb, index) => (
                        <span key={index} onClick={() => handleBreadcrumbClick(index)}>
                            {crumb} {index < breadcrumb.length - 1 && '>'}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Filter;
