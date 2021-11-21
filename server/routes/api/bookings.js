const router = require("express").Router();
const { Booking, User, Room } = require("../../db/models");
const moment = require('moment');

router.post("/", async (req, res, next) => {
  console.log('creating a booking', req.body)
  try {

    const { userId, bookingStart, bookingEnd, checkin, roomId, adults, children, message } = req.body;
    console.log('example time: ', moment(new Date(bookingStart)).format('YYYY-MM-DD'))
    const booking = await Booking.create({
      userId,
      bookingStart: moment(bookingStart).format('YYYY-MM-DD'),
      bookingEnd: moment(bookingEnd).format('YYYY-MM-DD'),
      checkinTime: null,
      transactionId: 'abc123',
      adults: 2,
      children: 0,
      roomId,
      message,
    });

    res.json({
      booking,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/:roomId", async (req, res, next) => {
  const room = req.params.roomId;
  try {
    const bookings = await Booking.findAll({
      where: {
        roomId:room
      },
      include: [
        { model: User, order: ["createdAt", "DESC"] },
        { model: Room, order: ["createdAt", "DESC"] },
      ],
    });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

module.exports = router;