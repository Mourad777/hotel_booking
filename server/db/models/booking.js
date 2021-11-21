const Sequelize = require("sequelize");
const db = require("../db");

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
  adults: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  children: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  transactionId: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  message: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = Booking;
