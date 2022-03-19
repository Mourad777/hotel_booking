const router = require("express").Router();
const { AccommodationBooking, User, Accommodation, Bed } = require("../../db/models");
const moment = require('moment');


const { isAccommodationAvailableAtDate } = require('../../utils')


router.get("/:accommodationId", async (req, res, next) => {
  const accommodation = req.params.accommodationId;
  console.log('accommodation id', accommodation)
  try {
    const bookings = await AccommodationBooking.findAll({
      where: {
        accommodationId: accommodation
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

    const { email, firstName, lastName, bookingStart, bookingEnd, checkin, accommodationId, adults, children, message, bedCount } = req.body;
    console.log('example time: ', moment(new Date(bookingStart)).format('YYYY-MM-DD'))

    console.log('bed count', bedCount)
    console.log(' email, firstName, lastName,', email, firstName, lastName,)
    const user = await User.findOne({ where: { email } });

    return
    let userId;  
    if (!user) {
      console.log('no user found')
      const newUser = await User.create({
        email,
        firstName,
        lastName,
        password: 'abc',
        isAdmin: false,
      })
      userId = newUser.id;
    } else {
      console.log('found user',user)
      userId = user.id
    }
    return
    //if accommodation is a dorm than check to see if there is enough beds available
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

      return

      if (bedIdsAvailable.length === 0) return res.json({ message: 'there are no beds available for these dates' })

      const bookings = []
      for (let i = 0; i < bedCount; i++) {
        booking = await AccommodationBooking.create({
          userId,
          bookingStart: bookingStart,
          bookingEnd: bookingEnd,
          checkinTime: null,
          transactionId: 'abc123',
          bedId: bedIdsAvailable[i],
          message,
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

      if (!isAccommodationAvailable) {
        isAccommodationAvailable = false;
        return res.json({ message: 'the accommodation is not available on these dates' })
      }

      console.log('isAccommodationAvailable', isAccommodationAvailable)

      return

      booking = await AccommodationBooking.create({
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
    }

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