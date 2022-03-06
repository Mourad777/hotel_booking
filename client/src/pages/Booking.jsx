import React from 'react'

export default function Booking({ match }) {
    let bookingType;
    const accommodationId = match.params.accommodationId
    const tourId = match.params.tourId
    if (accommodationId) bookingType = 'accommodation';
    if (tourId) bookingType = 'tour';

    return (
        <div>Booking</div>
    )
}
