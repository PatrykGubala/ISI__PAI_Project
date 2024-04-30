import './Register.css';
import React, { useState } from 'react';
import { Input, Button, Alert, Tooltip } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import {useNavigate} from "react-router-dom";

const Register = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const username_SERWER = 'user';
    const password_SERWER = 'password';
    //const token = btoa(`${username_SERWER}:${password_SERWER}`);
    const userData = {
        username: login,
        email: email,
        password: password,
        firstname: firstName,
        phoneNumber: phoneNumber,
        lastname: lastName,
        role: "USER",
    };


    const handleLoginChange = (e) => {
        if (e.target.value.length <= 30) {
            setLogin(e.target.value);
        }
    };
    const handlePasswordChange = (e) => {
        if (e.target.value.length <= 50) {
            setPassword(e.target.value);
        }
    };

    const handleConfirmPasswordChange = (e) => {
        if (e.target.value.length <= 50) {
            setConfirmPassword(e.target.value);
        }
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;
        if (value.length <= 30) {
            setEmail(value);
        }
    };

    const handleFirstNameChange = (e) => {
        const value = e.target.value;
        if ((/^[a-zA-Z]+$/.test(value) || value === '') && value.length <= 30) {
            setFirstName(value);
        }
    };

    const handleLastNameChange = (e) => {
        const value = e.target.value;
        if ((/^[a-zA-Z]+$/.test(value) || value === '') && value.length <= 30) {
            setLastName(value);
        }
    };

    const handlePhoneNumberChange = (e) => {
        const value = e.target.value;
        if ((/^\d+$/.test(value) || value === '')&& value.length <= 9) {
            setPhoneNumber(value);
        }
    };

    const handleSubmit = () => {
        if (
            firstName.trim() === '' ||
            lastName.trim() === '' ||
            phoneNumber.trim() === '' ||
            login.trim() === '' ||
            email.trim() === '' ||
            password.trim() === '' ||
            confirmPassword.trim() === ''
        ) {
            setErrorMessage('Wszystkie pola formularza są wymagane');
            return;
        }

        if (phoneNumber.length !== 9 || isNaN(phoneNumber)) {
            setErrorMessage('Numer telefonu musi składać się z 9 cyfr');
            return;
        }

        if (password !== confirmPassword) {
            setErrorMessage('Hasła nie są identyczne');
            return;
        } else if (login === password) {
            setErrorMessage('Login i hasło nie mogą być identyczne');
            return;
        } else if (!email.includes('@')) {
            setErrorMessage('Nieprawidłowy adres email');
            return;
        }


        if (password.length < 8) {
            setErrorMessage('Hasło musi mieć co najmniej 8 znaków');
            return;
        }


        if (!/[A-Z]/.test(password)) {
            setErrorMessage('Hasło musi zawierać co najmniej jedną dużą literę');
            return;
        }


        if (!/[a-z]/.test(password)) {
            setErrorMessage('Hasło musi zawierać co najmniej jedną małą literę');
            return;
        }


        const specialCharacterRegex = /[!@#$%^&*(),.?":{}|<>]/;
        if (!specialCharacterRegex.test(password)) {
            setErrorMessage('Hasło musi zawierać przynajmniej jeden znak specjalny');
            return;
        }

        console.log('Wszystkie pola są poprawne');
        setErrorMessage('');

        fetch('http://localhost:8080/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                //'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(userData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log('Registration successful:', data);
            })
            .catch(error => {
                console.error('Error during registration:', error);
            }, [username_SERWER, password_SERWER]);

        navigate("/");
    };

    return (
        <div className="register-page">
            <h2>Zarejestruj się</h2>
            <div className="form-group">
                <label htmlFor="firstName">Imię:</label>
                <Input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={handleFirstNameChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="lastName">Nazwisko:</label>
                <Input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={handleLastNameChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="phoneNumber">Numer telefonu:</label>
                <Input
                    type="text"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={handlePhoneNumberChange}
                />
            </div>
            <div className="form-group">
                <label htmlFor="login">Login:</label>
                <Input
                    type="text"
                    id="login"
                    value={login}
                    onChange={handleLoginChange}
                />
            </div>

            <div className="form-group">
                <label htmlFor="email">
                    Email:
                </label>
                <div className="password-input">
                <Input
                    type="text"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                />
                    <Tooltip
                        placement="right"
                        title={
                            <div>
                                <p>Email musi zawierać znak @.</p>
                            </div>
                        }
                    >
                        <QuestionCircleOutlined className="question-icon"/>
                    </Tooltip>
            </div>
            </div>

            <div className="form-group">
                <label htmlFor="password">Hasło:</label>
                <div className="password-input">
                    <Input.Password
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    <Tooltip
                        placement="right"
                        title={
                            <div>
                                <p>Hasło musi mieć co najmniej 8 znaków.</p>
                                <p>Musi zawierać co najmniej jedną dużą literę.</p>
                                <p>Musi zawierać co najmniej jedną małą literę.</p>
                                <p>Musi zawierać przynajmniej jeden znak specjalny.</p>
                            </div>
                        }
                    >
                        <QuestionCircleOutlined className="question-icon"/>
                    </Tooltip>
                </div>
            </div>

            <div className="form-group">
                <label htmlFor="confirmPassword">Potwierdź hasło:</label>
                <Input.Password
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                />
            </div>
            <div className="form-group">
                <Button type="primary" onClick={handleSubmit}>Zarejestruj</Button>
            </div>
            {errorMessage && <Alert className="error-alert" message={errorMessage} type="error" showIcon/>}
        </div>
    );
};

export default Register;
