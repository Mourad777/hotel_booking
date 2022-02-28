const router = require("express").Router();

router.use("/bookings", require("./bookings"));

router.use("/rooms", require("./rooms"));

router.use("/auth", require("./auth"));

router.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

module.exports = router;
