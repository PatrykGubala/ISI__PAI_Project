import './Register.css';
import React, { useState } from 'react';
import { Input, Button } from 'antd';

const Register = () => {
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = () => {
        if (login === password) {
            console.log('Login i hasło są zgodne');
            setErrorMessage('');
        } else {
            setErrorMessage('Login i hasło muszą być identyczne');
        }
    };

    return (
        <div className="register-page">
            <h2>Zarejestruj się</h2>
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
                <Button type="primary" onClick={handleSubmit}>Zarejestruj</Button>
            </div>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
        </div>
    );
};

export default Register;
