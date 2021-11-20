const router = require("express").Router();
const { Booking } = require("../../db/models");
const moment = require('moment');

router.post("/", async (req, res, next) => {
  console.log('creating a booking', req.body)
  try {

    const { userId, bookingStart, bookingEnd, checkin, roomId } = req.body;
    console.log('example time: ', moment(new Date(1637327299335)).format('YYYY-MM-DD'))
    const booking = await Booking.create({
      userId: 1,
      bookingStart: moment(new Date(1637327299335)).format('YYYY-MM-DD'),
      bookingEnd: moment(new Date(1637328299335)).format('YYYY-MM-DD'),
      checkinTime: moment(new Date(1637397299335)).format('YYYY-MM-DD'),
      roomId: 2,
    });

    res.json({
      booking,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;