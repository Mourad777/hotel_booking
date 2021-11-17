const Sequelize = require("sequelize");
const db = require("../db");

const Room = db.define("room", {
  type: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  
});

module.exports = Room;
