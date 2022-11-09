import React, { useState } from 'react'
import { StyledFormTextInput, StyledSubmitButton, } from '../../StyledComponents';
import { AppUrl } from '../../utility/utility';
import Loader from '../../components/Loader/Loader';
import { useHistory } from 'react-router';
import axios from 'axios';

const Register = ({ onLogin }) => {
    const history = useHistory();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isLoading, setIsLoading] = useState(false);

    const handleFirstName = (e) => {
        setFirstName(e.target.value);
    }
    const handleLastName = (e) => {
        setLastName(e.target.value);
    }

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword = e => {
        e.preventDefault();
        setPassword(e.target.value);
    };

    const handleConfirmPassword = e => {
        e.preventDefault();
        setConfirmPassword(e.target.value);
    };


    const handleForm = async (e) => {
        e.preventDefault()
        if ((password === confirmPassword) && !!password && !!email) {
            const formData = new FormData();
            formData.append('first_name', firstName || '');
            formData.append('last_name', lastName || '');
            formData.append('email', email || '');
            formData.append('password', password || '');
            const url = `${AppUrl}/auth/register`;
            const response = await axios.post(url, {
                firstName,
                lastName,
                email,
                password
            });

            const token = response.data.token;
            if (token) {
                localStorage.setItem('token', token)
            }
            // registerUser(url, formData, setIsLoading);
            onLogin(true);
            history.push('/create-room');
        }
    }


    return (
        <div style={{ margin: 'auto', maxWidth: 400 }}>
            <h1>Register</h1>
            <form onSubmit={handleForm}>
                {/* <div style={{ maxWidth: 350 }}>
                <p style={{ color: 'red' }}>Registration for the demo version is disabled</p>
            </div> */}
                {isLoading && <div style={{ position: 'fixed', zIndex: 5, top: '50%', left: '50%', transform: 'translateX(-50%)' }}><Loader /></div>}
                <div style={{ marginTop: 20 }}>
                    <label style={{ fontSize: '1.2em' }}>First Name</label>
                    <StyledFormTextInput value={firstName} onChange={handleFirstName} placeholder='First Name' />
                </div>
                <div style={{ marginTop: 20 }}>
                    <label style={{ fontSize: '1.2em' }}>Last Name</label>
                    <StyledFormTextInput value={lastName} onChange={handleLastName} placeholder='Last Name' />
                </div>
                <div style={{ marginTop: 20 }}>
                    <label style={{ fontSize: '1.2em' }}>Email</label>
                    <StyledFormTextInput value={email} onChange={handleEmail} placeholder='Email' />
                </div>
                <div style={{ marginTop: 20 }}>
                    <label style={{ fontSize: '1.2em' }}>Password</label>
                    <StyledFormTextInput type="password" value={password} onChange={handlePassword} placeholder='Password' />
                </div>
                <div style={{ marginTop: 20 }}>
                    <label style={{ fontSize: '1.2em' }}>Confirm Password</label>
                    <StyledFormTextInput type="password" value={confirmPassword} onChange={handleConfirmPassword} placeholder='Confirm Password' />
                </div>
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                    <StyledSubmitButton type='submit' >Submit </StyledSubmitButton>
                </div>
            </form>
        </div>
    )
}

export default Register
