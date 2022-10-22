import axios from "axios";
import { getDefaultHeader } from "../utility";
const { REACT_APP_API_URL } = process.env;

export const registerUser = async (url, formData, setIsLoading) => {
    let registrationResponse;
    setIsLoading(true)
    try {
        registrationResponse = await axios.post(
            url,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        )
    } catch (e) {
        setIsLoading(false)
        console.log('User registration response error: ', e)
    }
    setIsLoading(false)
    console.log('User registration response: ', registrationResponse)

    const token = registrationResponse.data.token;
    localStorage.setItem('token', token)
}

export const login = async (url, formData, setIsLoading) => {
    let loginResponse;
    setIsLoading(true);
    try {
        loginResponse = await axios.post(
            url,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            }
        )
    } catch (e) {
        setIsLoading(false)
        console.log('User login response error: ', e)
    }
    setIsLoading(false)
    console.log('User login response: ', loginResponse)

    const token = loginResponse.data.token;
    localStorage.setItem('token', token)
}

export const logout = async (setIsLoading) => {
    const url = `${REACT_APP_API_URL}/logout`;
    const token = localStorage.getItem('token');
    let logoutResponse;
    setIsLoading(true);
    try {
        logoutResponse = await axios.post(
            url,
            {},
            getDefaultHeader(token),
        )
    } catch (e) {
        setIsLoading(false)
        console.log('User logout response error: ', e)
    }
    setIsLoading(false)
    console.log('User logout response: ', logoutResponse)
}
