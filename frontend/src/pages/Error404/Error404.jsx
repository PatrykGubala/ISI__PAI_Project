import React from 'react';
import { Button, Result } from 'antd';
import { useNavigate } from 'react-router-dom';

const Error404 = () => {
    const navigate = useNavigate();

    const handleButtonClick = () => {
        navigate('/');
    };

    return (
        <Result
            status="404"
            title="404"
            subTitle="Hmm, zabłądziłeś."
            extra={<Button type="primary" onClick={handleButtonClick}>Zabierz mnie stąd</Button>}
        />
    );
};

export default Error404;
