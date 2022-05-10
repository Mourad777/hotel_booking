import axios from "axios";
import { AppUrl, getDefaultHeader } from "../utility";

export const getBookings = async (setBookings, setIsLoading) => {
    const token = localStorage.getItem('token');
    let res = {};
    setIsLoading(true)
    try {
        res = await axios.get(`${AppUrl}api/bookings`, getDefaultHeader(token));

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
    const token = localStorage.getItem('token');
    let res = {};
    setIsLoading(true)
    try {
        res = await axios.get(`${AppUrl}api/bookings/${reservationId}`, getDefaultHeader(token));

    } catch (e) {
        console.log('Fetch booking error', e)
        setIsLoading(false)
    }
    console.log('Fetch booking response', res)
    setIsLoading(false)
    return res.data || [];

}

export const createBooking = async (values, setIsLoading) => {
    const token = localStorage.getItem('token');
    let res = {};
    setIsLoading(true)
    try {

        const response = await axios.post('http://localhost:3001/api/bookings', values);

        console.log('response', response)

        return response.data

    } catch (e) {
        console.log('Create bookings error', e)
        setIsLoading(false)
    }
    console.log('Create bookings response', res)
    setIsLoading(false)
    return res.data
}