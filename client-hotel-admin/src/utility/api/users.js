import axios from "axios";
import { getDefaultHeader } from "../utility";
const { REACT_APP_API_URL } = process.env;

export const getUsers = async (setUsers, setIsLoading) => {
    const token = localStorage.getItem('token');
    let res = {};
    setIsLoading(true)
    try {
        res = await axios.get(`${REACT_APP_API_URL}/users`, getDefaultHeader(token));

    } catch (e) {
        console.log('Fetch users error', e)
        setIsLoading(false)
    }  
    console.log('Fetch users response', res)
    const users = res.data || [];
    setUsers(users);
    setIsLoading(false)
}
