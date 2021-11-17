const router = require("express").Router();
const { Booking } = require("../../db/models");
// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {

    const { userId, bookingStart, bookingEnd, checkin, roomId } = req.body;

    const booking = await Booking.create({
        userId,
        bookingStart,
        bookingEnd,
        checkin,
        roomId,
    });

    res.json({
      booking,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;