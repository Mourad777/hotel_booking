import axios from "axios";
import { getDefaultHeader } from "../utility";
const { REACT_APP_API_URL } = process.env;

export const getAmenities = async (setCheckedState, setIsLoading) => {
    const token = localStorage.getItem('token');
    let res = {};
    setIsLoading(true)
    try {
        res = await axios.get(`${REACT_APP_API_URL}/amenities`, getDefaultHeader(token));

    } catch (e) {
        console.log('Fetch amenities error', e)
        setIsLoading(false)
    }
    console.log('Fetch amenities response', res)
    const amenities = res.data || [];

    setCheckedState(new Array(amenities.length).fill(false))
    setIsLoading(false)
    return amenities;
}