import axios from 'axios'
import moment from 'moment'
const { REACT_APP_API_URL } = process.env;


export const submitReservation = async (values, setBookingMessage, setIsLoading) => {
    const { formValues, selectedAccommodationDates, accommodation } = values
    setIsLoading(true)
    try {
        const response = await axios.post(`${REACT_APP_API_URL}/bookings`, {
            ...formValues,
            bookingStart: moment.utc(selectedAccommodationDates[0]).format('YYYY-MM-DD HH:mm z'),
            bookingEnd: moment.utc(selectedAccommodationDates[1]).format('YYYY-MM-DD HH:mm z'),
            accommodationId: accommodation.id,
        });
        console.log('response', response)
        if (response.data) {
            setBookingMessage(response.data.message)
        }
        setIsLoading(false)
    } catch (e) {
        console.log('e', e)
        if (e.response) {
            setBookingMessage(e.response.data.message)
        }
        setIsLoading(false)
    }
}

export const fetchAccommodations = async (value, setAccommodations, setIsLoading) => {
    setIsLoading(true)
    try {
        if (!value || (value[0] === value[1])) {
            const res = await axios.get(`${REACT_APP_API_URL}/accommodations/all/all`);
            console.log('res accommodations', res)
            setAccommodations(res.data)
        } else {
            const fromDate = moment(value[0]);
            const toDate = moment(value[1]);
            const checkinDateFormatted = moment(fromDate).format('YYYY-MM-DD HH:mm z');
            const checkoutDateFormatted = moment(toDate).format('YYYY-MM-DD HH:mm z');
            const res = await axios.get(`${REACT_APP_API_URL}/accommodations/${checkinDateFormatted}/${checkoutDateFormatted}`);
            console.log('res accommodations', res)
            setAccommodations(res.data)
        }
        setIsLoading(false)
    } catch (e) {
        console.log('e', e.response)
        setIsLoading(false)
    }
}

export const fetchSingleAccommodations = async (id, setAccommodation, setIsLoading) => {
    setIsLoading(true)
    try {
        const res = await axios.get(`${REACT_APP_API_URL}/accommodations/${id}`);
        console.log('Fetch single accommodation response: ', res)
        setAccommodation(res.data);
        setIsLoading(false)
    } catch (e) {
        console.log('error', e.response)
        setIsLoading(false)
    }

}