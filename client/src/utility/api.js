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
        if(response.data){
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