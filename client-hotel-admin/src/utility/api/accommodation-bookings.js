import axios from "axios";
const { REACT_APP_API_URL } = process.env;

export const getBookings = async (setBookings, setIsLoading) => {

    setIsLoading(true)
    try {
        const res = await axios.get(`${REACT_APP_API_URL}/bookings`);
        console.log('Fetch bookings response', res)
        const bookings = res.data || [];
        setBookings(bookings);
        setIsLoading(false)
    } catch (e) {
        console.log('Fetch bookings error', e.response)
        setIsLoading(false)
    }
}

export const getBooking = async (reservationId, setIsLoading) => {
    setIsLoading(true)
    try {
        const res = await axios.get(`${REACT_APP_API_URL}/bookings/${reservationId}`);
        console.log('Fetch booking response', res)
        setIsLoading(false)
        return res.data || [];
    } catch (e) {
        console.log('Fetch booking error', e.response)
        setIsLoading(false)
    }
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
        console.log('Create bookings error', e.response)
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
        console.log('Update bookings error', e.response)
        if (e.response) {
            setBookingMessage(e.response.data.message)
        }
        setIsLoading(false)
    }
}

export const deleteBooking = async (id, setIsLoading) => {
    setIsLoading(true)
    try {
        const res = await axios.delete(`${REACT_APP_API_URL}/bookings/delete/${id}`);
        setIsLoading(false)
        console.log('Fetch bookings response', res)
    } catch (e) {
        console.log('Fetch bookings error', e.response)
        setIsLoading(false)
    }
}