const router = require("express").Router();
const { Booking, User, Accommodation } = require("../../db/models");
const moment = require('moment');
const { toJSON, fromJSON } = require('flatted');

router.get("/:checkin/:checkout", async (req, res, next) => {
    const checkinDate = req.params.checkin;
    const checkoutDate = req.params.checkout;

    try {
        const accommodations = await Accommodation.findAll({
            include: [
                { model: Booking, order: ["createdAt", "DESC"] },
            ],
            raw: true,
            nest: true
        });

        console.log('query:', accommodations)

        const momentCheckinDate = moment(checkinDate);
        const momentCheckoutDate = moment(checkoutDate);

        console.log('momentCheckinDate', momentCheckinDate);
        console.log('momentCheckoutDate', momentCheckoutDate);

        const availableAccommodations = [];

        accommodations.forEach(accommodation => {
            let isAccommodationAvailable = true;
            console.log('accommodation.bookings.length > 0', accommodation.bookings.length > 0)
            if (!accommodation.bookings.length > 0) {
                availableAccommodations.push(accommodation)
                return
            }


            accommodation.bookings.forEach(booking => {
                const momentBookingStart = moment(booking.bookingStart);
                const momentBookingEnd = moment(booking.bookingEnd);
                const isDatesOccupied = (momentCheckinDate.isBetween(momentBookingStart, momentBookingEnd)) ||
                    (momentCheckoutDate.isBetween(momentBookingStart, momentBookingEnd))

                if (isDatesOccupied) {
                    isAccommodationAvailable = false;
                    return
                }
            })

            if (isAccommodationAvailable) {
                availableAccommodations.push(accommodation)
            }

        });

        //since the available accomodations will include beds in dorm rooms and a bed is considered an accommodation, need to make sure that the 
        //list of accomodations doesn't included the same room twice but rather group the beds of the same room inside a nested array

        const dormRooms = []


        const sortedAvailableAccommodations = availableAccommodations.map(accommodation => {
            if (accommodation.roomId) {
                const roomIndex = dormRooms.findIndex(room => room.roomId === accommodation.roomId)
                const isRoomInList = roomIndex > -1
                if (isRoomInList) {
                    dormRooms.push({ ...dormRooms[roomIndex], beds: [...dormRooms[roomIndex].beds, accommodation] })
                    dormRooms.splice(roomIndex, 1);
                } else {
                    //remove certain properties from accomodation object if its a dorm, as those properties are
                    //already in the nested bed object, the user will book a bed and not the whole dorm room
                    const accommodationClone = (({ bedNumber, bookings, capacity, ...o }) => o)(accommodation)
                    dormRooms.push({ ...accommodationClone, beds: [accommodation] })
                }
                return null;
            } else {
                return {
                    ...accommodation,

                }
            }
        })



        // bedNumber: 3
        // beds: (2) [{…}, {…}]
        // bookings: {id: null, bookingStart: null, bookingEnd: null, checkinTime: null, adults: null, …}
        // capacity: 10
        // createdAt: "2022-03-03T14:46:33.698Z"
        // id: 5
        // image: "/hotel-rooms/hotel-g8a8ee587a_640.jpg"
        // isPetsAllowed: true
        // isRefrigerator: true
        // isWifi: true
        // roomId: 2
        // type: "dorm"

        const accommodationsWithDorms = [...sortedAvailableAccommodations, ...dormRooms];
        console.log('length of array', accommodationsWithDorms.length)
        console.log('accommodationsWithDorms', accommodationsWithDorms)
        res.json(accommodationsWithDorms.filter(accommodation => accommodation));
    } catch (error) {
        next(error);
    }
});



router.post("/create", async (req, res, next) => {


    try {

    } catch (error) {
        next(error);
    }
});

router.put("/update", async (req, res, next) => {


    try {

    } catch (error) {
        next(error);
    }
});

router.delete("/delete", async (req, res, next) => {


    try {

    } catch (error) {
        next(error);
    }
});

module.exports = router;