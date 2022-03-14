const Sequelize = require("sequelize");
const db = require("../db");

const AccommodationBooking = db.define("accommodation_booking", {
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
    allowNull: true,
  },
  children: {
    type: Sequelize.INTEGER,
    allowNull: true,
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

module.exports = AccommodationBooking;
