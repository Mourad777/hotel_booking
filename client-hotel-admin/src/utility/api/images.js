import axios from "axios";
const { REACT_APP_API_URL } = process.env;

export const createImage = async (values, setIsLoading) => {
    setIsLoading(true)
    try {
        const response = await axios.post(`${REACT_APP_API_URL}/images`, values);
        console.log('Create image document response response', response)
        setIsLoading(false)
        return response.data
    } catch (e) {
        console.log('Create image document error', e)
        setIsLoading(false)
    }
}

export const deleteImage = async (id, setIsLoading) => {
    setIsLoading(true)
    try {
        const response = await axios.delete(`${REACT_APP_API_URL}/images/delete/${id}`);
        setIsLoading(false)
        console.log('Delete image document response', response)
        return response.data
    } catch (e) {
        console.log('Delete image document error', e)
        setIsLoading(false)
    }
}
