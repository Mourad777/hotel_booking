const Booking = require("./booking");
// const User = require("./user");
const Room = require("./room");

// associations

Room.hasMany(Booking);

module.exports = {
    Booking,
    Room,
    // User,
};
