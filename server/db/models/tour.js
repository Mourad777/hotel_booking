const Sequelize = require("sequelize");
const db = require("../db");

const Tour = db.define("tour", {
  type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  price: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  capacity: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  image: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  duration: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  timeSlots: {
    type: Sequelize.ARRAY(Sequelize.INTEGER),
    allowNull: false,
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

module.exports = Tour;
