import axios from "axios";
const { REACT_APP_API_URL } = process.env;

export const getUsers = async (setUsers, setIsLoading) => {
    setIsLoading(true)
    try {
       const res = await axios.get(`${REACT_APP_API_URL}/users`);
       console.log('Fetch users response', res)
       const users = res.data || [];
       setUsers(users);
       setIsLoading(false)

    } catch (e) {
        console.log('Fetch users error', e.response)
        setIsLoading(false)
    }  
}
