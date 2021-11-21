const Sequelize = require("sequelize");
const db = require("../db");

const Room = db.define("room", {
  type: {
    type: Sequelize.STRING,
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
});

module.exports = Room;
