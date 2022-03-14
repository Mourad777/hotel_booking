const moment = require('moment')

const isAccommodationAvailableAtDate = (bookings, currentDate) => {
    const isAvailable = !((bookings.findIndex(booking => {
        return moment(currentDate).isBetween(moment(booking.bookingStart).subtract(1, 'days'), moment(booking.bookingEnd).subtract(1, 'days'))
            ||
            moment(formattedDate).isSame(booking.bookingStart)
    }
    ) > -1)
        ||
        moment(formattedDate).isBefore(moment().subtract(1, 'days')))

    return isAvailable;
}

exports.isAccommodationAvailableAtDate = isAccommodationAvailableAtDate;