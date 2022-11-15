const router = require("express").Router();
const { AccommodationBooking, User, Accommodation, Image } = require("../../db/models");
const moment = require('moment');


const { isAccommodationAvailableAtDate } = require('../../utils');
const { Op } = require("sequelize");

router.get("/:bookingId", async (req, res, next) => {
  const bookingId = req.params.bookingId;

  try {
    const booking = await AccommodationBooking.findOne({
      where: { id: bookingId }, include: [
        { model: User, order: ["createdAt", "DESC"] },
        {
          model: Accommodation, order: ["createdAt", "DESC"], include: [
          ],
        },
      ],
    });

    res.json(booking);
  } catch (error) {
    next(error);
  }
});

router.get("/", async (req, res, next) => {
  try {
    const bookings = await AccommodationBooking.findAll({
      include: [
        { model: User, order: ["createdAt", "DESC"] },
        { model: Accommodation, order: ["createdAt", "DESC"], include: [
          { model: Image, order: ["createdAt", "DESC"] },
        ], },
      ],
    });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {

  //need either user id or email to locate a user
  if (!req.body.userId && !req.body.email) {
    return res.json({ error: 'Need to provide either a user id or e-mail' })
  }

  try {

    const { email = '', firstName, lastName, bookingStart, bookingEnd, accommodationId } = req.body;

    const accommodation = await Accommodation.findOne({
      where: { id: accommodationId }, include: [
        { model: AccommodationBooking, order: ["createdAt", "DESC"] },
      ],
    });
    if (!accommodation) {
      return res.json({ message: 'No accommodation found with the provided Id' })
    }

    let userId;

    const user = await User.findOne({
      where: {
        [Op.or]: [{ id: req.body.userId || null }, { email: email.trim().toLowerCase() }]
        // email: email.trim().toLowerCase() 
      }
    });
    //if user is new create a new user in the db
    if (!user) {
      const newUser = await User.create({
        email: email.trim().toLowerCase(),
        firstName,
        lastName,
        password: 'abc',
        isAdmin: false,
      })
      userId = newUser.id;
    } else {
      userId = user.id
    }

    let booking;

      let isAccommodationAvailable = true;
      for (var m = moment(bookingStart); m.isBefore(bookingEnd); m.add(1, 'days')) {
        const formattedDate = m.format('YYYY-MM-DD');
        const isAvailable = isAccommodationAvailableAtDate(accommodation.accommodation_bookings, formattedDate);

        if (!isAvailable) {
          isAccommodationAvailable = false;
        }
      }
      if (!isAccommodationAvailable) {
        isAccommodationAvailable = false;
        return res.json({ message: 'the accommodation is not available on these dates' })
      }

      booking = await AccommodationBooking.create({
        transactionId: 'abc123',
        userId,
        ...req.body
      });
    
    res.json({
      booking,
    });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  const { bookingStart, bookingEnd } = req.body
  const bookingId = req.params.id;

  try {
    const booking = await AccommodationBooking.findByPk(bookingId);
    booking.bookingStart = bookingStart
    booking.bookingEnd = bookingEnd
    await booking.save()
  } catch (error) {
    next(error);
  }
});

router.delete("/delete/:bookingId", async (req, res, next) => {

  try {
    const bookingId = req.params.bookingId;

    const deleteResult = await AccommodationBooking.destroy({
        where: {
            id: bookingId
        },
    })

    res.send({deleteResult})

  } catch (error) {
    next(error);
  }
});

module.exports = router;