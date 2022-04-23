import axios from "axios";
import { AppUrl, getDefaultHeader } from "../utility";

export const getConfiguration = async (setIsLoading) => {
    const url = `${AppUrl}api/configurations`;
    let configResponse = {};
    setIsLoading(true);
    try {
        configResponse = await axios.get(url);
    } catch (e) {
        setIsLoading(false)
        console.log('Fetch configuration response error: ', e)
    }

    setIsLoading(false)
    console.log('Fetch configuration response: ', configResponse);
    return configResponse.data || {};
}

export const updateConfiguration = async (formData, setIsLoading) => {
    const token = localStorage.getItem('token');
    const url = `${AppUrl}api/configurations/update`;
    let configResponse;
    setIsLoading(true);
    try {
        configResponse = await axios.post(
            url,
            formData,
            getDefaultHeader(token)
        );
    } catch (e) {
        setIsLoading(false)
        console.log('Update configuration response error: ', e)
    }
    setIsLoading(false)
    console.log('Update configuration response: ', configResponse)
}