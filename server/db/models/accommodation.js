const Sequelize = require("sequelize");
const db = require("../db");

const Accommodation = db.define("accommodations", {
  type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  price: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  capacity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  isPetsAllowed: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  isWifi: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  isRefrigerator: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  image: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  bedCount:{
    type: Sequelize.INTEGER,
    allowNull: true,
  }
  // roomId: {
  //   type: Sequelize.INTEGER,
  //   allowNull: true,
  // },
  // bedNumber: {
  //   type: Sequelize.INTEGER,
  //   allowNull: true,
  // },
});

module.exports = Accommodation;
