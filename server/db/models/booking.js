const Sequelize = require("sequelize");
const db = require("../db");

const Booking = db.define("booking", {
  text: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  bookingStart: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  bookingEnd: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  checkinTime: {
    type: Sequelize.DATE,
    allowNull: true,
  },
});

module.exports = Booking;
