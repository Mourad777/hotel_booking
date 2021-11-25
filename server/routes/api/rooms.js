const router = require("express").Router();
const { Booking, User, Room } = require("../../db/models");
const moment = require('moment');

router.get("/:checkin/:checkout", async (req, res, next) => {
    const checkinDate = req.params.checkin;
    const checkoutDate = req.params.checkout;
    console.log('checkinDate', checkinDate);
    console.log('checkoutDate', checkoutDate);
    // return
    try {
        const rooms = await Room.findAll({
            include: [
                { model: Booking, order: ["createdAt", "DESC"] },

                // {
                //     model: Table2,
                //     include: [
                //       {
                //         model: Table3,
                //         where: { deleted: 0 },
                //         include: [
                //           {
                //             model: Table4,
                //             where: { deleted: 0 },
                //           },
                //         ],
                //       },
                //     ],
                //   },

            ],
        });

        const momentCheckinDate = moment(checkinDate);
        const momentCheckoutDate = moment(checkoutDate);

        console.log('momentCheckinDate', momentCheckinDate)
        console.log('momentCheckoutDate', momentCheckoutDate)

        const availableRooms = [];

        rooms.forEach(room => {
            console.log('room id: ', room.id)
            console.log('bookings: ', room.bookings)
            let isRoomAvailable = true;
            room.bookings.forEach(booking => {
                const momentBookingStart = moment(booking.bookingStart);
                const momentBookingEnd = moment(booking.bookingEnd);
                console.log('momentBookingStart', momentBookingStart);
                console.log('momentBookingEnd', momentBookingEnd);
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

module.exports = router;