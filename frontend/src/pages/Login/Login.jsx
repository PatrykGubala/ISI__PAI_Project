import './Login.css';
import React, { useState, useContext } from 'react';
import { Input, Button, Alert } from 'antd';
import { AuthContext } from '../../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../Interceptors/axiosInstance';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userId, setUid] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { login: authenticateUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async () => {
        const userData = {
            username: username,
            password: password,
        };

        try {
            const response = await axiosInstance.post('/auth/login', userData);

            const { access_token, refresh_token} = response.data;
            const tokenPayload = access_token.split('.')[1];
            const decodedPayload = JSON.parse(atob(tokenPayload));
            const userRole = decodedPayload.sub;
            authenticateUser();
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);
            localStorage.setItem('user_role', userRole);
            localStorage.setItem('username', username);
            navigate('/');
        } catch (error) {
            console.error('Error during login:', error);
            setErrorMessage('Wystąpił błąd podczas logowania');
        }
    };
    const handleOAuth2Login = (provider) => {
        window.location.href = `http://localhost:8080/oauth2/authorization/${provider}`;
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
                <Button type="primary" onClick={handleSubmit}>Zaloguj</Button>
            </div>
            {errorMessage && <Alert className="error-alert" message={errorMessage} type="error" showIcon/>}
            <div className="oauth2-buttons">
                <button className="google-login-button" onClick={() => handleOAuth2Login('google')}>
                    <img
                        src='https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_"G"_logo.svg'
                        alt="Google logo" width="20" height="20"/>
                    Login with Google
                </button>
            </div>
        </div>
    );
};

export default Login;