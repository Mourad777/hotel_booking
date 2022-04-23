import axios from "axios";
import { AppUrl, getDefaultHeader } from "../utility";

export const getAmenities = async (setAmenities,setCheckedState, setIsLoading) => {
    const token = localStorage.getItem('token');
    let res = {};
    setIsLoading(true)
    try {
        res = await axios.get(`${AppUrl}api/amenities`, getDefaultHeader(token));

    } catch (e) {
        console.log('Fetch amenities error', e)
        setIsLoading(false)
    }
    console.log('Fetch amenities response', res)
    const amenities = res.data || [];
    setAmenities(amenities);
    setCheckedState(new Array(amenities.length).fill(false))
    setIsLoading(false)
}