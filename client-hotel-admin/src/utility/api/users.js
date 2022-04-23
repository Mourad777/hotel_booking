import axios from "axios";
import { AppUrl, getDefaultHeader } from "../utility";

export const getUsers = async (setUsers, setIsLoading) => {
    const token = localStorage.getItem('token');
    let res = {};
    setIsLoading(true)
    try {
        res = await axios.get(`${AppUrl}api/users`, getDefaultHeader(token));

    } catch (e) {
        console.log('Fetch users error', e)
        setIsLoading(false)
    }
    console.log('Fetch users response', res)
    const users = res.data || [];
    setUsers(users.map(user => ({ key: user.id, value: user.id, text: user.firstName + ' ' + `(${user.email})` })));
    setIsLoading(false)
}