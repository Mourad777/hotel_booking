const Booking = require("./booking");
const User = require("./user");
const Accommodation = require("./accommodation");
const Configuration = require("./configuration");
// associations

Accommodation.hasMany(Booking);
User.hasMany(Booking);
Booking.belongsTo(User);
Booking.belongsTo(Accommodation);

module.exports = {
    Booking,
    Accommodation,
    User,
    Configuration,
};
