import { v1 } from "uuid";
import moment from "moment";

export const getKey = (file, path) => {
    const filename = (file || {}).name || "";
    const fileExtension =
        filename.substring(filename.lastIndexOf(".") + 1, filename.length) ||
        filename;
    const key = `${path}/${v1() + "." + fileExtension}`;
    return key;
};

export const AppUrl = 'http://localhost:3001/';
// export let AppUrl = 'https://stormy-forest-71570.herokuapp.com/';
// if (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") {
//     // AppUrl = 'http://localhost:8000/';
//     AppUrl = 'https://stormy-forest-71570.herokuapp.com/';
// }


export const isAccommodationAvailable = (bookings, currentDate) => {
    if (!bookings) return false;
    return (bookings.findIndex(booking => moment(currentDate).isBetween(moment(booking.bookingStart), moment(booking.bookingEnd), 'day')
        ||
        moment(currentDate).isSame(booking.bookingStart, 'day')
    ) > -1) //disable dates between the checkin checkout date but exclude checkout date to allow users to book on that date in the afternoon
}

export const getDefaultHeader = (token) => {
    console.log('token..', token)
    return {
        headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: "Bearer " + token,
        }
    }
}

export const orderPhotos = (photos, order) => {

    const orderedPhotos = [];
    order.forEach(number => {
        photos.forEach(photo => {
            if (photo.id === number) {
                orderedPhotos.push(photo);
            }
        })
    });
    return orderedPhotos;

}
