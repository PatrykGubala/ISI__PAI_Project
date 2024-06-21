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
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [categoryFields, setCategoryFields] = useState([]);
    const [breadcrumb, setBreadcrumb] = useState([]);
    const [fieldTypes, setFieldTypes] = useState({});

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
                        <SubMenu key={category.id} title={category.name} onTitleClick={() => handleMenuClick({ key: category.id })}>
                            {buildMenu(categories, category.id)}
                        </SubMenu>
                    );
                }
                return (
                    <Menu.Item key={category.id} onClick={() => handleMenuClick({ key: category.id })}>
                        {category.name}
                    </Menu.Item>
                );
            });
    };

    const findCategoryPath = (categoryId, categories) => {
        let path = [];
        let currentCategory = categories.find(category => category.id === categoryId);
        while (currentCategory) {
            path.unshift(currentCategory);
            currentCategory = categories.find(category => category.id === currentCategory.parentCategoryId);
        }
        return path;
    };

    const handleMenuClick = async ({ key }) => {
        const categoryPath = findCategoryPath(key, categories);
        if (categoryPath.length) {
            const selectedCategory = categoryPath[categoryPath.length - 1];
            setSelectedCategory(selectedCategory.name);
            setSelectedCategoryId(selectedCategory.id);
            setBreadcrumb(categoryPath);
            form.setFieldsValue({ category: selectedCategory.name });

            try {
                const response = await axiosInstance.get(`/categories/${key}/fields`);
                setCategoryFields(response.data);
                const types = response.data.reduce((acc, field) => {
                    acc[field.name] = field.fieldType;
                    return acc;
                }, {});
                setFieldTypes(types);
            } catch (error) {
                console.error('Error fetching category fields:', error);
                message.error('Failed to fetch category fields');
            }
        }
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
            {buildMenu(categories)}
        </Menu>
    );

    const renderField = (field) => {
        switch (field.fieldType) {
            case 'RANGE':
                return (
                    <Form.Item key={field.name} label={field.name} name={field.name} className="full-width">
                        <Slider
                            range
                            min={field.defaultRangeMin}
                            max={field.defaultRangeMax}
                            defaultValue={[field.defaultRangeMin, field.defaultRangeMax]}
                            onChange={(value) => form.setFieldsValue({ [field.name]: value })}
                        />
                    </Form.Item>
                );
            case 'ENUM':
                return (
                    <Form.Item key={field.name} label={field.name} name={field.name} className="full-width">
                        <Select mode="multiple" placeholder={`Wybierz  ${field.name}`}>
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
        const filters = {};
        Object.keys(values).forEach(key => {
            if (fieldTypes[key] === 'RANGE' && Array.isArray(values[key])) {
                filters[`${key}Min`] = values[key][0];
                filters[`${key}Max`] = values[key][1];
            } else if (fieldTypes[key] === 'ENUM' && values[key] && values[key].length > 0) {
                filters[key] = values[key];
            } else if (fieldTypes[key] !== 'ENUM') {
                filters[key] = values[key];
            }
        });

        if (values.priceFrom && values.priceTo) {
            filters.priceRange = [parseFloat(values.priceFrom), parseFloat(values.priceTo)];

        }

        handleFilter({ ...filters, category: selectedCategoryId });
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
                            {crumb.name} {index < breadcrumb.length - 1 ? ' > ' : ''}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Filter;
