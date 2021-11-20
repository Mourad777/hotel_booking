const Sequelize = require("sequelize");
const db = require("../db");
const Room = require("./room");
const User = require("./user");

const Booking = db.define("booking", {
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
