const Sequelize = require("sequelize");
const db = require("../db");

const TourBooking = db.define("tour_booking", {
  tourDate: {
    type: Sequelize.DATE,
    allowNull: false,
  },
  timeSlot: {
    type: Sequelize.INTEGER,
    allowNull: false,
  }, 
  peopleCount: {
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

module.exports = TourBooking;
