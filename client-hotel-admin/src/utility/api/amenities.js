import axios from "axios";
const { REACT_APP_API_URL } = process.env;

export const getAmenities = async (setCheckedState, setIsLoading) => {
    setIsLoading(true)
    try {
        const res = await axios.get(`${REACT_APP_API_URL}/amenities`);
        console.log('Fetch amenities response', res)
        const amenities = res.data || [];
        setCheckedState(new Array(amenities.length).fill(false))
        setIsLoading(false)
        return amenities;
    } catch (e) {
        console.log('Fetch amenities error', e)
        setIsLoading(false)
    }
}