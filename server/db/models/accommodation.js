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
    allowNull: true,
  },
  bedCount:{
    type: Sequelize.INTEGER,
    allowNull: true,
  },
  imagesOrder: {
    type: Sequelize.ARRAY(Sequelize.INTEGER),
    allowNull: true,
  },
  isDraft: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
});

module.exports = Accommodation;
