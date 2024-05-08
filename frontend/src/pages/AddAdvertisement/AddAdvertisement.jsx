import React, { useState } from 'react';
import './AddAdvertisement.css';
import { Button, Input, Upload, DatePicker, Form, message, Select } from 'antd';
import { CameraOutlined, TagsOutlined, DollarOutlined, PhoneOutlined, EnvironmentOutlined, AlignLeftOutlined } from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;

const AddAdvertisement = () => {
    const [advertisementData, setAdvertisementData] = useState({
        title: '',
        price: '',
        date: moment(),
        phoneNumber: '',
        location: '',
        description: '',
        category: '', // Nowe pole dla kategorii
        images: []
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAdvertisementData({ ...advertisementData, [name]: value });
    };

    const handleImageUpload = (info) => {
        if (info.fileList.length > 0) {
            const images = info.fileList.map((file) => file.originFileObj);
            setAdvertisementData({ ...advertisementData, images });
        }
    };

    const handleCategoryChange = (value) => {
        setAdvertisementData({ ...advertisementData, category: value });
    };

    const handleSubmit = () => {
        if (!advertisementData.title || !advertisementData.price || !advertisementData.phoneNumber || !advertisementData.location || !advertisementData.description || !advertisementData.category) {
            message.error('Wypełnij wszystkie wymagane pola');
            return;
        }

        if (!/^\d+$/.test(advertisementData.price)) {
            message.error('Cena powinna zawierać tylko cyfry');
            return;
        }

        if (!/^\d{9}$/.test(advertisementData.phoneNumber)) {
            message.error('Numer telefonu powinien zawierać dokładnie 9 cyfr');
            return;
        }

        if (advertisementData.title.length > 50) {
            message.error('Tytuł może zawierać maksymalnie 50 znaków');
            return;
        }
        if (advertisementData.location.length > 50) {
            message.error('Lokalizacja może zawierać maksymalnie 50 znaków');
            return;
        }

        if (advertisementData.description.length > 500) {
            message.error('Opis może zawierać maksymalnie 500 znaków');
            return;
        }

        console.log(advertisementData);
        message.success('Oferta została dodana');
    };

    return (
        <Form className="advertisement-form">
            <div className="image-upload">
                <Form.Item>
                    <Upload
                        accept="image/*"
                        beforeUpload={() => false}
                        onChange={handleImageUpload}
                        multiple
                    >
                        <Button icon={<CameraOutlined />} className="upload-button">Wybierz zdjęcia</Button>
                    </Upload>
                </Form.Item>
            </div>
            <div className="advertisement-details">
                <Form.Item label="Data dodania">
                    <DatePicker
                        defaultValue={advertisementData.date}
                        disabled
                        style={{ width: '100%' }}
                    />
                </Form.Item>
                <Form.Item label="Kategoria" required>
                    <Select
                        placeholder="Wybierz kategorię"
                        onChange={handleCategoryChange}
                        value={advertisementData.category}
                    >
                        <Option value="meble">Meble</Option>
                        <Option value="elektronika">Elektronika</Option>
                        <Option value="samochody">Samochody</Option>
                    </Select>
                </Form.Item>
                <Form.Item label="Tytuł" required>
                    <Input
                        prefix={<TagsOutlined />}
                        placeholder="Tytuł"
                        name="title"
                        value={advertisementData.title}
                        onChange={handleInputChange}
                        maxLength={50}
                    />
                </Form.Item>
                <Form.Item label="Cena" required>
                    <Input
                        prefix={<DollarOutlined />}
                        placeholder="Cena"
                        name="price"
                        value={advertisementData.price}
                        onChange={handleInputChange}
                    />
                </Form.Item>
                <Form.Item label="Numer telefonu" required>
                    <Input
                        prefix={<PhoneOutlined />}
                        placeholder="Numer telefonu"
                        name="phoneNumber"
                        value={advertisementData.phoneNumber}
                        onChange={handleInputChange}
                    />
                </Form.Item>
                <Form.Item label="Lokalizacja" required>
                    <Input
                        prefix={<EnvironmentOutlined />}
                        placeholder="Lokalizacja"
                        name="location"
                        value={advertisementData.location}
                        onChange={handleInputChange}
                    />
                </Form.Item>
                <Form.Item label="Opis" required>
                    <Input.TextArea
                        prefix={<AlignLeftOutlined />}
                        placeholder="Opis"
                        name="description"
                        value={advertisementData.description}
                        onChange={handleInputChange}
                        autoSize={{ minRows: 3 }}
                        maxLength={500}
                    />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" onClick={handleSubmit}>Dodaj ofertę</Button>
                </Form.Item>
            </div>
        </Form>
    );
}

export default AddAdvertisement;
