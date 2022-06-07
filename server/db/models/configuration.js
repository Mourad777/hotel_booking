const Sequelize = require("sequelize");
const db = require("../db");

const Configuration = db.define("configuration", {
  bookingPaymentRequired: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  mainHeaderImage: {
    type: Sequelize.STRING,
    allowNull: true,
  },
});

module.exports = Configuration;
