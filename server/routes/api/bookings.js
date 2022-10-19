const router = require("express").Router();
const { AccommodationBooking, User, Accommodation, Bed, Image } = require("../../db/models");
const moment = require('moment');


const { isAccommodationAvailableAtDate } = require('../../utils');
const { Op } = require("sequelize");


// router.get("/:accommodationId", async (req, res, next) => {
//   const accommodation = req.params.accommodationId;
//   console.log('accommodation id', accommodation)
//   try {
//     const bookings = await AccommodationBooking.findAll({
//       where: {
//         accommodationId: accommodation
//       },
//       include: [
//         { model: User, order: ["createdAt", "DESC"] },
//         { model: Accommodation, order: ["createdAt", "DESC"] },
//       ],
//     });

//     res.json(bookings);
//   } catch (error) {
//     next(error);
//   }
// });

router.get("/:bookingId", async (req, res, next) => {
  const bookingId = req.params.bookingId;

  try {
    const bookings = await AccommodationBooking.findOne({
      where: { id: bookingId }, include: [
        { model: User, order: ["createdAt", "DESC"] },
        {
          model: Accommodation, order: ["createdAt", "DESC"], include: [
            { model: Bed, order: ["createdAt", "DESC"] },
          ],
        },
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


  console.log('creating a booking', req.body)
  //need either user id or email to locate a user
  if (!req.body.userId && !req.body.email) {
    return res.json({ error: 'Need to provide either a user id or e-mail' })
  }

  try {

    const { email = '', firstName, lastName, bookingStart, bookingEnd, accommodationId, bedCount } = req.body;
    // console.log('example time: ', moment(new Date(bookingStart)).format('YYYY-MM-DD'))

    const accommodation = await Accommodation.findOne({
      where: { id: accommodationId }, include: [
        { model: AccommodationBooking, order: ["createdAt", "DESC"] },
        {
          model: Bed, order: ["createdAt", "DESC"], include: [
            { model: AccommodationBooking, order: ["createdAt", "DESC"] },
          ],
        },
      ],
    });
    console.log('accommodation', accommodation)
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

    if (!user) {
      console.log('no user found')

      const newUser = await User.create({
        email: email.trim().toLowerCase(),
        firstName,
        lastName,
        password: 'abc',
        isAdmin: false,
      })
      userId = newUser.id;
    } else {
      console.log('found user', user)
      userId = user.id

    }



    //if accommodation is a dorm than check to see if there is enough beds available

    let booking;
    if (accommodation.type === 'Dorm') {

      const unavailableBedIds = [];

      const beds = accommodation.beds;

      //loop through each date to check which beds are available on each date

      for (var m = moment(bookingStart); m.isBefore(bookingEnd); m.add(1, 'days')) {
        const formattedDate = m.format('YYYY-MM-DD');
        console.log('DATE ******************************: ', m)
        for (let i = 0; i < beds.length; i++) {
          console.log('BED ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^', beds[i].id)
          const isAvailable = isAccommodationAvailableAtDate(beds[i].accommodation_bookings, formattedDate)

          if (!isAvailable) {
            unavailableBedIds.push(beds[i].id)
          }
        }
      }

      const bedIdsAvailable = accommodation.beds.map(bed => {
        if (unavailableBedIds.includes(bed.id)) return null
        return bed.id
      }).filter(item => item);

      console.log(' bedIdsAvailable', bedIdsAvailable)

      if (bedIdsAvailable.length === 0) return res.json({ message: 'there are no beds available for these dates' })

      const bookings = []
      for (let i = 0; i < bedCount; i++) {
        booking = await AccommodationBooking.create({
          userId,
          transactionId: 'abc123',
          bedId: bedIdsAvailable[i], // review this
          ...req.body,
        });
        bookings.push(booking)
      }
      booking = bookings
    } else {


      let isAccommodationAvailable = true;
      for (var m = moment(bookingStart); m.isBefore(bookingEnd); m.add(1, 'days')) {
        const formattedDate = m.format('YYYY-MM-DD');
        console.log('DATE ******************************: ', m)
        const isAvailable = isAccommodationAvailableAtDate(accommodation.accommodation_bookings, formattedDate);

        if (!isAvailable) {
          isAccommodationAvailable = false;
        }
      }
      console.log('isAccommodationAvailable', isAccommodationAvailable)
      if (!isAccommodationAvailable) {
        isAccommodationAvailable = false;
        return res.json({ message: 'the accommodation is not available on these dates' })
      }

      console.log('creating booking for accommodation without bed req.body:::',req.body)
      booking = await AccommodationBooking.create({
        // userId,
        // bookingStart,
        // bookingEnd,
        // checkinTime: null,
        transactionId: 'abc123',
        // adults: null,
        // children: null,
        // accommodationId:accommodation.id,
        // message,
        userId,
        ...req.body
      });
    }

    res.json({
      booking,
    });
  } catch (error) {
    next(error);
  }
});


router.put("/:id", async (req, res, next) => {
  const { email = '', firstName, lastName, bookingStart, bookingEnd, accommodationId, bedCount } = req.body
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

router.delete("/delete", async (req, res, next) => {

  try {

  } catch (error) {
    next(error);
  }
});

module.exports = router;