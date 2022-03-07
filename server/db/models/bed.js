const Sequelize = require("sequelize");
const db = require("../db");

const Bed = db.define("bed", {
    bunkbedLevel: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    isBunkbed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    accommodationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    }
});

module.exports = Bed;
