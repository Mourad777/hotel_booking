export const updateAccommodationsState = (accommodations, accommodationId, booking, bookingId) => {
    const updatedAccommodations = accommodations.map(accommodation => {
        //if there is a bookingId we know its not a new booking and need to update the previous booking
        if (!bookingId && accommodationId === accommodation.id) {
            const updatedBookings = accommodation.accommodation_bookings.push(booking)
            return {...accommodation,bookings:updatedBookings}
        } else if (bookingId && accommodationId === accommodation.id) {
            const updatedBookings = accommodation.accommodation_bookings.map(booking=>{
                if(booking.id === bookingId) {
                    return booking
                } else return booking
            })
            return {...accommodation,bookings:updatedBookings}
        } else return accommodation
    })
    return updatedAccommodations
}