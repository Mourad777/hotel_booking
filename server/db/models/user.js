const Sequelize = require("sequelize");
const db = require("../db");
const Booking = require("./booking");

const User = db.define("user", {
    firstName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    lastName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false,
    },
});

// User.associate = (models) => {
//     User.hasMany(models.Booking, {
//         foreignKey: {
//             name: 'userId',
//             allowNull: false
//         },
//     });
// };


module.exports = User;
