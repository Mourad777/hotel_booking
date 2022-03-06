const router = require("express").Router();
const { Booking, User, Accommodation } = require("../../db/models");
const moment = require('moment');
const { QueryTypes } = require("sequelize");

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

router.get("/:accommodationId", async (req, res, next) => {
    const accommodationId = req.params.accommodationId;

    try {
        const accommodation = await Accommodation.findByPk(accommodationId);
        res.json(accommodation);
    } catch (error) {
        next(error);
    }
});

router.get("/:checkin/:checkout", async (req, res, next) => {
    const checkinDate = req.params.checkin;
    const checkoutDate = req.params.checkout;

    try {
        const accommodations = await Accommodation.findAll({
            include: [
                { model: Booking, order: ["createdAt", "DESC"], raw: true, nest: true, rowMode: 'array' },
            ],
            // raw: true,
            // nest: true,
            // rowMode: "array"
        });

        console.log('returning accoms', accommodations)

        // res.json(accommodations)
        
        console.log('query:', accommodations);

        const momentCheckinDate = moment(checkinDate);
        const momentCheckoutDate = moment(checkoutDate);

        console.log('momentCheckinDate', momentCheckinDate);
        console.log('momentCheckoutDate', momentCheckoutDate);

        const availableAccommodations = [];

        accommodations.forEach(accommodation => {
            let isAccommodationAvailable = true;
            console.log('accommodation.bookings', 'accommodation.id:' + accommodation.id, accommodation.bookings)
            console.log('accommodation.bookings.length', accommodation.bookings.length)
            if (accommodation.bookings.length === 0) {
                // if (!accommodation.bookings || isEmpty(accommodation.bookings)) {
                // if (accommodation.id == '1') return;
                // if (!accommodation.bookings || accommodation.length === 0) {
                // if(true){
                console.log(accommodation.id, 'no booking', accommodation.bookings)
                availableAccommodations.push(accommodation)
                return
            }

            accommodation.bookings.forEach(booking => {
                console.log('**************************in each booking',booking)
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

        //get only data values from accommodations array
        const rawAvailableAccommodations = availableAccommodations.map(accommodation=>accommodation.dataValues)
        console.log('rawAvailableAccommodations',rawAvailableAccommodations);
        //since the available accomodations will include beds in dorm rooms and a bed is considered an accommodation, need to make sure that the 
        //list of accomodations doesn't included the same room twice but rather group the beds of the same room inside a nested array

        const dormRooms = []


        const sortedAvailableAccommodations = rawAvailableAccommodations.map(accommodation => {
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

        const accommodationsWithDorms = [...sortedAvailableAccommodations, ...dormRooms];
        console.log('accommodationsWithDorms',accommodationsWithDorms)
        // res.json(accommodationsWithDorms)
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