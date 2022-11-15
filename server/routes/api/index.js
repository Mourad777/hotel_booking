const router = require("express").Router();

router.use("/bookings", require("./bookings"));

router.use("/accommodations", require("./accommodations"));

router.use("/users", require("./users"));

router.use("/images", require("./images"));

router.use("/amenities", require("./amenities"));

router.use("/uploads", require("./uploadFile"));

router.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

module.exports = router;
