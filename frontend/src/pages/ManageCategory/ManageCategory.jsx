import React, { useState, useEffect } from 'react';
import { Button, Input, Form, message, Select, Checkbox, Menu, Dropdown } from 'antd';
import axiosInstance from '../Interceptors/axiosInstance';
import { useNavigate } from 'react-router-dom';
import './ManageCategory.css';
import Header from '../../components/Header/Header';

const { Option } = Select;
const { SubMenu } = Menu;

const ManageCategory = () => {
    const [form] = Form.useForm();
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [fields, setFields] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('None');

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axiosInstance.get('/categories');
            setCategories(response.data);
        } catch (error) {
            message.error('Failed to fetch categories');
        }
    };

    const handleAddField = () => {
        setFields([...fields, { name: '', fieldType: 'ENUM', filterable: false, defaultEnumValues: [''], filterEnumValues: [''], defaultRangeMin: null, defaultRangeMax: null, filterRangeMin: null, filterRangeMax: null }]);
    };

    const handleFieldChange = (index, field) => {
        const updatedFields = fields.map((f, i) => (i === index ? { ...f, ...field } : f));
        setFields(updatedFields);
    };

    const handleEnumValueChange = (fieldIndex, type, valueIndex, newValue) => {
        const updatedFields = fields.map((field, index) => {
            if (index === fieldIndex) {
                const updatedValues = [...field[type]];
                updatedValues[valueIndex] = newValue;
                return { ...field, [type]: updatedValues };
            }
            return field;
        });
        setFields(updatedFields);
    };

    const handleAddEnumValue = (fieldIndex, type) => {
        const updatedFields = fields.map((field, index) => {
            if (index === fieldIndex) {
                return { ...field, [type]: [...field[type], ''] };
            }
            return field;
        });
        setFields(updatedFields);
    };

    const handleRemoveEnumValue = (fieldIndex, type, valueIndex) => {
        const updatedFields = fields.map((field, index) => {
            if (index === fieldIndex) {
                const updatedValues = field[type].filter((_, i) => i !== valueIndex);
                return { ...field, [type]: updatedValues };
            }
            return field;
        });
        setFields(updatedFields);
    };

    const handleSubmit = async (formData) => {
        const data = {
            ...formData,
            fields: fields.map(field => ({
                ...field,
                defaultEnumValuesJson: field.defaultEnumValues.join(','),
                filterEnumValuesJson: field.filterEnumValues.join(',')
            })),
        };

        try {
            await axiosInstance.post('/admin/addCategory', data);
            message.success('Category added successfully');
            navigate('/');
        } catch (error) {
            message.error('Failed to add category');
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
                return (
                    <Menu.Item key={category.id}>
                        {category.name}
                    </Menu.Item>
                );
            });
    };

    const handleMenuClick = ({ key }) => {
        const selectedCategory = categories.find(category => category.id === key);
        setSelectedCategory(selectedCategory ? selectedCategory.name : 'None');
        form.setFieldsValue({ parentCategoryId: selectedCategory ? selectedCategory.id : null });
    };

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key={null}>None</Menu.Item>
            {buildMenu(categories)}
        </Menu>
    );

    return (
        <div className="manage-category-container">
            <Header />
            <Form form={form} onFinish={handleSubmit} initialValues={{ name: '', description: '', parentCategoryId: null }}>
                <Form.Item label="Nazwa" name="name" rules={[{ required: true, message: 'Proszę wprowadzić nazwę' }]}>
                    <Input />
                </Form.Item>

                <Form.Item label="Opis" name="description" rules={[{ required: true, message: 'Proszę wprowadzić opis' }]}>
                    <Input.TextArea />
                </Form.Item>

                <Form.Item label="Kategoria macierzysta" name="parentCategoryId">
                    <Dropdown overlay={menu} trigger={['click']} className="custom-dropdown">
                        <Button className="custom-dropdown-btn">
                            {selectedCategory}
                        </Button>
                    </Dropdown>
                </Form.Item>

                {fields.map((field, index) => (
                    <div key={index} className="field-container">
                        <Form.Item label={`Pole ${index + 1} Nazwa`} required>
                            <Input value={field.name} onChange={e => handleFieldChange(index, { name: e.target.value })} />
                        </Form.Item>

                        <Form.Item label={`Pole ${index + 1} Rodzaj`} required>
                            <Select value={field.fieldType} onChange={value => handleFieldChange(index, { fieldType: value })}>
                                <Option value="ENUM">ENUM</Option>
                                <Option value="RANGE">RANGE</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item>
                            <Checkbox checked={field.filterable} onChange={e => handleFieldChange(index, { filterable: e.target.checked })}>
                                Filterable
                            </Checkbox>
                        </Form.Item>

                        {field.fieldType === 'ENUM' && (
                            <>
                                <Form.Item label={`Default Enum Values`}>
                                    {field.defaultEnumValues.map((value, valueIndex) => (
                                        <div key={valueIndex} className="enum-value-container">
                                            <Input value={value} onChange={e => handleEnumValueChange(index, 'defaultEnumValues', valueIndex, e.target.value)} />
                                            <Button type="link" onClick={() => handleRemoveEnumValue(index, 'defaultEnumValues', valueIndex)}>Usuń</Button>
                                        </div>
                                    ))}
                                    <Button type="dashed" onClick={() => handleAddEnumValue(index, 'defaultEnumValues')}>Dodaj wartości domyślne</Button>
                                </Form.Item>
                                <Form.Item label={`Filter Enum Values`}>
                                    {field.filterEnumValues.map((value, valueIndex) => (
                                        <div key={valueIndex} className="enum-value-container">
                                            <Input value={value} onChange={e => handleEnumValueChange(index, 'filterEnumValues', valueIndex, e.target.value)} />
                                            <Button type="link" onClick={() => handleRemoveEnumValue(index, 'filterEnumValues', valueIndex)}>Usuń</Button>
                                        </div>
                                    ))}
                                    <Button type="dashed" onClick={() => handleAddEnumValue(index, 'filterEnumValues')}>Dodaj wartości filtrowania</Button>
                                </Form.Item>
                            </>
                        )}

                        {field.fieldType === 'RANGE' && (
                            <>
                                <Form.Item label={`Domyślna wartość Min`}>
                                    <Input type="number" value={field.defaultRangeMin} onChange={e => handleFieldChange(index, { defaultRangeMin: e.target.value })} />
                                </Form.Item>
                                <Form.Item label={`Domyślna wartość Max`}>
                                    <Input type="number" value={field.defaultRangeMax} onChange={e => handleFieldChange(index, { defaultRangeMax: e.target.value })} />
                                </Form.Item>
                                <Form.Item label={`Filtrowana wartość Min`}>
                                    <Input type="number" value={field.filterRangeMin} onChange={e => handleFieldChange(index, { filterRangeMin: e.target.value })} />
                                </Form.Item>
                                <Form.Item label={`Filtrowana wartość Max`}>
                                    <Input type="number" value={field.filterRangeMax} onChange={e => handleFieldChange(index, { filterRangeMax: e.target.value })} />
                                </Form.Item>
                            </>
                        )}
                    </div>
                ))}

                <Form.Item>
                    <Button type="dashed" onClick={handleAddField}>
                        Dodaj pole
                    </Button>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Dodaj kategorie
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default ManageCategory;
