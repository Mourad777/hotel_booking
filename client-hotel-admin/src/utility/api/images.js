import axios from "axios";
import { AppUrl, getDefaultHeader } from "../utility";

export const createImage = async (values, setIsLoading) => {
    // const token = localStorage.getItem('token');
    let res = {};
    setIsLoading(true)
    try {

        const response = await axios.post(`${AppUrl}api/images`, values);

        console.log('response', response)

        return response.data

    } catch (e) {
        console.log('Create image document error', e)
        setIsLoading(false)
    }
    console.log('Create image document response', res)
    setIsLoading(false)
    return res.data
}