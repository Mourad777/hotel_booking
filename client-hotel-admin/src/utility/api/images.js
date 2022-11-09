import axios from "axios";
const { REACT_APP_API_URL } = process.env;

export const createImage = async (values, setIsLoading) => {
    // const token = localStorage.getItem('token');
    let res = {};
    setIsLoading(true)
    try {

        const response = await axios.post(`${REACT_APP_API_URL}/images`, values);

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

export const deleteImage = async (id, setIsLoading) => {
    // const token = localStorage.getItem('token');
    let res = {};
    setIsLoading(true)
    try {

        const response = await axios.delete(`${REACT_APP_API_URL}/images/delete/${id}`);

        console.log('response', response)

        return response.data

    } catch (e) {
        console.log('Delete image document error', e)
        setIsLoading(false)
    }
    console.log('Delete image document response', res)
    setIsLoading(false)
    return res.data
}
