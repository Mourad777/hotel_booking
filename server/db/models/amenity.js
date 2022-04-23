const Sequelize = require("sequelize");
const db = require("../db");

const Amenity = db.define("amenity", {
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

module.exports = Amenity;
