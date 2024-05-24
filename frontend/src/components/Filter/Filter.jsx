import React, { useState, useEffect } from 'react';
import {Form, Input, Select, Button, message} from 'antd';
import './Filter.css';
import axiosInstance from '../../pages/Interceptors/axiosInstance.js';

const { Option } = Select;

const Filter = ({ handleFilter }) => {
    const [form] = Form.useForm();
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [qualities, setQualities] = useState([]);
    const [loading, setLoading] = useState(false);

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

        const fetchSubcategories = async () => {
            try {
                const response = await axiosInstance.get('/subcategories');
                setSubcategories(response.data);
            } catch (error) {
                console.error('Error fetching subcategories:', error);
                message.error('Failed to fetch subcategories');
            }
        };

        const fetchQualities = async () => {
            try {
                const response = await axiosInstance.get('/qualities');
                setQualities(response.data);
            } catch (error) {
                console.error('Error fetching qualities:', error);
                message.error('Failed to fetch qualities');
            }
        };

        fetchCategories();
        fetchSubcategories();
        fetchQualities();
    }, []);

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
                            <Select placeholder="Wybierz kategorie">
                                {categories.map(category => (
                                    <Option key={category._id} value={category.name}>{category.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>

                    <div className="col">
                        <Form.Item label="Podkategoria" name="subcategory">
                            <Select placeholder="Wybierz podkategorie">
                                {subcategories.map(subcategory => (
                                    <Option key={subcategory._id} value={subcategory.name}>{subcategory.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </div>

                    <div className="colPrice">
                        <Form.Item label="Cena od" name="priceFrom">
                            <Input placeholder="Od"/>
                        </Form.Item>
                    </div>

                    <div className="colPrice">
                        <Form.Item label="Cena do" name="priceTo">
                            <Input placeholder="Do"/>
                        </Form.Item>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <Form.Item label="Miejscowość" name="location">
                            <Input placeholder="Wpisz miejscowość"/>
                        </Form.Item>
                    </div>

                    <div className="col">
                        <Form.Item label="Stan" name="quality">
                            <Select placeholder="Wybierz stan">
                                {qualities.map(quality => (
                                    <Option key={quality._id} value={quality.name}>{quality.name}</Option>
                                ))}
                            </Select>
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
}

export default Filter;
