import axios from "axios";
const { REACT_APP_API_URL } = process.env;

export const getBookings = async (setBookings, setIsLoading) => {
    let res = {};
    setIsLoading(true)
    try {
        res = await axios.get(`${REACT_APP_API_URL}/bookings`);

    } catch (e) {
        console.log('Fetch bookings error', e)
        setIsLoading(false)
    }
    console.log('Fetch bookings response', res)
    const bookings = res.data || [];
    setBookings(bookings);
    setIsLoading(false)
}

export const getBooking = async (reservationId, setIsLoading) => {
    let res = {};
    setIsLoading(true)
    try {
        res = await axios.get(`${REACT_APP_API_URL}/bookings/${reservationId}`);

    } catch (e) {
        console.log('Fetch booking error', e)
        setIsLoading(false)
    }
    console.log('Fetch booking response', res)
    setIsLoading(false)
    return res.data || [];

}

export const createBooking = async (values, setIsLoading, setBookingMessage) => {
    setIsLoading(true)
    try {
        const response = await axios.post(`${REACT_APP_API_URL}/bookings`, values);
        console.log('booking response', response)
        if (response.data) {
            setBookingMessage(response.data.message)
        }
        setIsLoading(false)
        return response.data.booking
    } catch (e) {
        console.log('Create bookings error', e)
        if (e.response) {
            setBookingMessage(e.response.data.message)
        }
        setIsLoading(false)
    }
}

export const updateBooking = async (values, reservationId, setIsLoading, setBookingMessage) => {
    setIsLoading(true)
    try {
        const response = await axios.put(`${REACT_APP_API_URL}/bookings/${reservationId}`, values);
        console.log('response', response)
        if (response.data) {
            setBookingMessage(response.data.message)
        }
        setIsLoading(false)
        return response.data.booking
    } catch (e) {
        console.log('Update bookings error', e)
        if (e.response) {
            setBookingMessage(e.response.data.message)
        }
        setIsLoading(false)
    }
}

export const deleteBooking = async (id, setIsLoading) => {
    let res;
    setIsLoading(true)
    try {
        res = await axios.delete(`${REACT_APP_API_URL}/bookings/delete/${id}`);

    } catch (e) {
        console.log('Fetch bookings error', e)
        setIsLoading(false)
    }
    setIsLoading(false)
    console.log('Fetch bookings response', res)
}