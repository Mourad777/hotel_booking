const router = require("express").Router();
const { AccommodationBooking, User, Accommodation, Bed } = require("../../db/models");
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
                { model: AccommodationBooking, order: ["createdAt", "DESC"] },
                {
                    model: Bed, order: ["createdAt", "DESC"], include: [
                        { model: AccommodationBooking, order: ["createdAt", "DESC"] },
                    ], 
                },
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
        const availableBeds = [];

        accommodations.forEach(accommodation => {

            

            accommodation.beds.forEach(bed=>{
                let isBedAvailable = true;

                if (bed.accommodation_bookings.length === 0) {
                    //if the bed has no booking we already know it is available for any date
                    availableBeds.push(bed)
                    return
                }

                bed.accommodation_bookings.forEach(booking => {

                    const momentBookingStart = moment(booking.bookingStart);
                    const momentBookingEnd = moment(booking.bookingEnd);
                    const isDatesOccupied = (momentCheckinDate.isBetween(momentBookingStart, momentBookingEnd)) ||
                        (momentCheckoutDate.isBetween(momentBookingStart, momentBookingEnd))
    
                    if (isDatesOccupied) {
                        isBedAvailable = false;
                        return
                    }
                })
    
                if (isBedAvailable) {
                    availableBeds.push(bed)
                }

            })

            let isAccommodationAvailable = true;

            if (accommodation.accommodation_bookings.length === 0) {
                //if the accommodation has no booking we already know it is available for any date

                availableAccommodations.push(accommodation)
                return
            }

            accommodation.accommodation_bookings.forEach(booking => {

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
        const rawAvailableAccommodations = availableAccommodations.map(accommodation => accommodation.dataValues)
        const rawAvailableAccommodationsWithBeds = rawAvailableAccommodations.map(accommodation=>{
            return {...accommodation,beds:accommodation.beds.filter(bed=>availableBeds.findIndex(availableBed=>availableBed.accommodationId===bed.accommodationId) > -1)}
        })
        console.log('rawAvailableAccommodations', rawAvailableAccommodations);
        console.log('rawAvailableAccommodationsWithBeds',rawAvailableAccommodationsWithBeds)
        //since the available accomodations will include beds in dorm rooms and a bed is considered an accommodation, need to make sure that the 
        //list of accomodations doesn't included the same room twice but rather group the beds of the same room inside a nested array

        // const dormRooms = []


        // const sortedAvailableAccommodations = rawAvailableAccommodations.map(accommodation => {
        //     if (accommodation.roomId) {
        //         const roomIndex = dormRooms.findIndex(room => room.roomId === accommodation.roomId)
        //         const isRoomInList = roomIndex > -1
        //         if (isRoomInList) {
        //             dormRooms.push({ ...dormRooms[roomIndex], beds: [...dormRooms[roomIndex].beds, accommodation] })
        //             dormRooms.splice(roomIndex, 1);
        //         } else {
        //             //remove certain properties from accomodation object if its a dorm, as those properties are
        //             //already in the nested bed object, the user will book a bed and not the whole dorm room
        //             const accommodationClone = (({ bedNumber, bookings, capacity, ...o }) => o)(accommodation)
        //             dormRooms.push({ ...accommodationClone, beds: [accommodation] })
        //         }
        //         return null;
        //     } else {
        //         return {
        //             ...accommodation,

        //         }
        //     }
        // })

        // const accommodationsWithDorms = [...sortedAvailableAccommodations, ...dormRooms];
        // console.log('accommodationsWithDorms', accommodationsWithDorms)
        res.json(rawAvailableAccommodationsWithBeds)
        // res.json(accommodationsWithDorms.filter(accommodation => accommodation));
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