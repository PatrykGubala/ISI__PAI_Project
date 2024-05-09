import './Login.css';
import React, { useState, useContext } from 'react';
import {Input, Button, Alert} from 'antd';
import { AuthContext } from '../../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { login: authenticateUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = () => {
        const userData = {
            username: username,
            password: password
        };

        fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
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
                console.log('Login successful:', data);
                const { access_token, refresh_token } = data;
                authenticateUser();
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', refresh_token);
                navigate("/");
            })


            .catch(error => {
                console.error('Error during login:', error);
                setErrorMessage('Wystąpił błąd podczas logowania');
            });
    };

    return (
        <div className="Login-page">
            <h2>Zaloguj się</h2>
            <div className="form-group">
                <label htmlFor="Login">Login:</label>
                <Input
                    type="text"
                    id="username"
                    value={username}
                    placeholder="Login"
                    onChange={(e) => setUsername(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="password">Hasło:</label>
                <Input.Password
                    id="password"
                    value={password}
                    placeholder="Hasło"
                    className="custom-password-input"
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="form-group">
                <Button type="primary"  onClick={handleSubmit}>Zaloguj</Button>
            </div>
            {errorMessage && <Alert className="error-alert" message={errorMessage} type="error" showIcon/>}
        </div>
    );
};

export default Login;
