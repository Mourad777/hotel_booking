const Booking = require("./booking");
const User = require("./user");
const Room = require("./room");

// associations

Room.hasMany(Booking);
User.hasMany(Booking);
Booking.belongsTo(User);
Booking.belongsTo(Room);

module.exports = {
    Booking,
    Room,
    User,
};
