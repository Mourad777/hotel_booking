const router = require("express").Router();
const { Booking, User, Room } = require("../../db/models");
const moment = require('moment');

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

router.get("/", async (req, res, next) => {
  try {
    const bookings = await Booking.findAll({
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

router.post("/", async (req, res, next) => {
  console.log('creating a booking', req.body)
  try {

    const { userId, bookingStart, bookingEnd, checkin, roomId, adults, children, message } = req.body;
    console.log('example time: ', moment(new Date(bookingStart)).format('YYYY-MM-DD'))
    const booking = await Booking.create({
      userId,
      bookingStart: bookingStart,
      bookingEnd: bookingEnd,
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