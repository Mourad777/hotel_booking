const Sequelize = require("sequelize");
const db = require("../db");

const Configuration = db.define("configuration", {
  bookingPaymentRequired: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
});

module.exports = Configuration;
