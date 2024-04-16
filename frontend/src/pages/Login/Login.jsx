import './Login.css';
import React, { useState, useContext  } from 'react';
import { Input, Button } from 'antd';
import { AuthContext } from '../../hooks/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const { login: authenticateUser } = useContext(AuthContext);
    const navigate = useNavigate()

    const handleSubmit = () => {
        if (login === password) {
            console.log('Login i hasło są zgodne');
            authenticateUser();
            setErrorMessage('');
            navigate(-1);
        } else {
            setErrorMessage('Login i hasło muszą być identyczne');
        }
    };

    return (
        <div className="Login-page">
            <h2>Zaloguj się</h2>
            <div className="form-group">
                <label htmlFor="login">Login:</label>
                <Input
                    type="text"
                    id="login"
                    value={login}
                    onChange={(e) => setLogin(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="password">Hasło:</label>
                <Input.Password
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="form-group">
                <Button type="primary" onClick={handleSubmit}>Zaloguj</Button>
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
    );
};

export default Login;
