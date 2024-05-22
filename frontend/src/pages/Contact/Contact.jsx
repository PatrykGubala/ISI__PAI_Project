import React from 'react';
import { Form, Input, Button, message } from 'antd';
import axiosInstance from '../Interceptors/axiosInstance';
import './Contact.css';
import Header from '../../components/Header/Header';

const { TextArea } = Input;

const Contact = () => {
    const [form] = Form.useForm();

    const handleSubmit = async (formData) => {
        try {
            await axiosInstance.post('/contact', formData);
            message.success('Wiadomość wysłana pomyślnie');
            form.resetFields();
        } catch (error) {
            console.error('Błąd podczas wysyłania wiadomości:', error);
            message.error('Nie udało się wysłać wiadomości');
        }
    };

    return (
        <div className="contact-container">
            <Header />
            <div className="contact-form-container">
                <h2>Skontaktuj się z nami</h2>
                <Form
                    form={form}
                    onFinish={handleSubmit}
                    initialValues={{
                        name: '',
                        email: '',
                        subject: '',
                        message: '',
                    }}
                >
                    <Form.Item
                        label="Imię"
                        name="name"
                        rules={[{ required: true, message: 'Proszę wprowadzić imię' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[{ required: true, type: 'email', message: 'Proszę wprowadzić poprawny email' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Temat"
                        name="subject"
                        rules={[{ required: true, message: 'Proszę wprowadzić temat' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Wiadomość"
                        name="message"
                        rules={[{ required: true, message: 'Proszę wprowadzić wiadomość' }]}
                    >
                        <TextArea rows={4} />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Wyślij wiadomość
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
};

export default Contact;
