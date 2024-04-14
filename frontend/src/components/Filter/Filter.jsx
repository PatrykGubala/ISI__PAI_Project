import React from 'react';
import { Form, Input, Select, Button, DatePicker, Space } from 'antd';
import './Filter.css';

const { Option } = Select;

const Filter = ({ handleFilter }) => {
    const [form] = Form.useForm();

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
                                <Option value="electronics">Elektronika</Option>
                                <Option value="furniture">Meble</Option>
                                <Option value="cars">Auta</Option>
                            </Select>
                        </Form.Item>
                    </div>


                    <div className="col">
                        <Form.Item label="Stan" name="condition">
                            <Select placeholder="Wybierz stan">
                                <Option value="new">Nowy</Option>
                                <Option value="used">Używany</Option>
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
                        <Form.Item label="Data produkcji" name="date">
                            <DatePicker picker="year" className="custom-datepicker"/>
                        </Form.Item>
                    </div>


                    <div className="col">
                        <Form.Item label="Stan" name="condition">
                            <Select placeholder="Wybierz stan">
                                <Option value="new">Nowy</Option>
                                <Option value="used">Używany</Option>
                            </Select>
                        </Form.Item>
                    </div>
                </div>

                <div className="row">

                    <div className="col">
                        <Form.Item label="Stan" name="condition">
                            <Select placeholder="Wybierz stan">
                            <Option value="new">Nowy</Option>
                                <Option value="used">Używany</Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="col">
                        <Form.Item label="Stan" name="condition">
                            <Select placeholder="Wybierz stan">
                                <Option value="new">Nowy</Option>
                                <Option value="used">Używany</Option>
                            </Select>
                        </Form.Item>
                    </div>
                    <div className="col">
                        <Form.Item label="Stan" name="condition" >
                            <Select placeholder="Wybierz stan">
                                <Option value="new">Nowy</Option>
                                <Option value="used">Używany</Option>
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
