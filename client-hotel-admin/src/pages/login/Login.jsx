import React, { useState } from 'react'
import { StyledFormTextInput, StyledSubmitButton, } from '../../StyledComponents';
import { AppUrl } from '../../utility/utility';
import Loader from '../../components/Loader/Loader';
import { useHistory } from 'react-router';
import { login } from '../../utility/api';

const Login = ({ onLogin }) => {
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword = e => {
        e.preventDefault();
        setPassword(e.target.value);
    };


    const handleForm = async (e) => {
        e.preventDefault()
        if (!!password && !!email) {
            const formData = new FormData();
            formData.append('email', email || '');
            formData.append('password', password || '');
            const url = `${AppUrl}api/login`;
            await login(url, formData, setIsLoading);
            onLogin(true);
            history.push('/posts');
        }
    }


    return (
        <div style={{ margin: 'auto', maxWidth: 400 }}>
            <h1>Login</h1>
            <div style={{maxWidth:350}}>
                <p style={{color:'red'}}>Use email demo_user@gmail.com and password TazmanianDevil2021 for testing purposes</p>
            </div>
            {isLoading && <div style={{ position: 'fixed', zIndex: 5, top: '50%', left: '50%', transform: 'translateX(-50%)' }}><Loader /></div>}
            <div>
                <label style={{ fontSize: '1.2em' }}>Email</label>
                <StyledFormTextInput value={email} onChange={handleEmail} placeholder='Email' />
            </div>
            <div style={{ marginTop: 20 }}>
                <label style={{ fontSize: '1.2em' }}>Password</label>
                <StyledFormTextInput type="password" value={password} onChange={handlePassword} placeholder='Password' />
            </div>
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <StyledSubmitButton onClick={handleForm} >{'Submit'}</StyledSubmitButton>
            </div>
        </div>
    )
}

export default Login
