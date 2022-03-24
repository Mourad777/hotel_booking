import moment from 'moment';

export const isAccommodationAvailable = (bookings, currentDate) => {
    if (!bookings) return false;
    return (bookings.findIndex(booking => moment(currentDate).isBetween(moment(booking.bookingStart), moment(booking.bookingEnd),'day')
        ||
        moment(currentDate).isSame(booking.bookingStart,'day')
    ) > -1) //disable dates between the checkin checkout date but exclude checkout date to allow users to book on that date in the afternoon
}