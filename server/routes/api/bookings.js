const router = require("express").Router();
const { AccommodationBooking, User, Accommodation } = require("../../db/models");
const moment = require('moment');

router.get("/:accommodationId", async (req, res, next) => {
  const accommodation = req.params.accommodationId;
  console.log('accommodation id',accommodation)
  try {
    const bookings = await AccommodationBooking.findAll({
      where: {
        accommodationId:accommodation
      },
      include: [
        { model: User, order: ["createdAt", "DESC"] },
        { model: Accommodation, order: ["createdAt", "DESC"] },
      ],
    });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const bookings = await AccommodationBooking.findAll({
      include: [
        { model: User, order: ["createdAt", "DESC"] },
        { model: Accommodation, order: ["createdAt", "DESC"] },
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

    const { userId, bookingStart, bookingEnd, checkin, accommodationId, adults, children, message } = req.body;
    console.log('example time: ', moment(new Date(bookingStart)).format('YYYY-MM-DD'))

    //if accommodation is a dorm than check to see if there is enough beds available
    const accommodation = await Accommodation.findByPk(accommodationId);
    console.log('found accommodation: ', accommodation);
    if(accommodation.type === 'dorm') {
      const totalBeds = accommodation.totalBeds;
      const bedsOccupied = await AccommodationBooking.count({ where: { accommodationId: accommodationId }});
      const availableBeds = totalBeds - bedsOccupied;
      console.log('availableBeds',availableBeds)
      if(availableBeds <= 0) {
        return
      }
    }

    const booking = await AccommodationBooking.create({
      userId,
      bookingStart: bookingStart,
      bookingEnd: bookingEnd,
      checkinTime: null,
      transactionId: 'abc123',
      adults: 2,
      children: 0,
      accommodationId,
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