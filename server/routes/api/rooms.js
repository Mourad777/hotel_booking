const router = require("express").Router();
const { Booking, User, Room } = require("../../db/models");
const moment = require('moment');

router.get("/:checkin/:checkout", async (req, res, next) => {
    const checkinDate = req.params.checkin;
    const checkoutDate = req.params.checkout;

    try {
        const rooms = await Room.findAll({
            include: [
                { model: Booking, order: ["createdAt", "DESC"] },
            ],
        });

        const momentCheckinDate = moment(checkinDate);
        const momentCheckoutDate = moment(checkoutDate);

        console.log('momentCheckinDate', momentCheckinDate)
        console.log('momentCheckoutDate', momentCheckoutDate)

        const availableRooms = [];

        rooms.forEach(room => {
            let isRoomAvailable = true;
            room.bookings.forEach(booking => {
                const momentBookingStart = moment(booking.bookingStart);
                const momentBookingEnd = moment(booking.bookingEnd);
                if (
                    (momentCheckinDate.isBetween(momentBookingStart, momentBookingEnd)) ||
                    (momentCheckoutDate.isBetween(momentBookingStart, momentBookingEnd))
                ) {
                    isRoomAvailable = false;
                    return
                }
            })
            if(isRoomAvailable) {
                availableRooms.push(room)
            }

        });

        res.json(availableRooms);
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