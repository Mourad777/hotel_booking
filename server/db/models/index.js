const AccommodationBooking = require("./accommodationBooking");
const User = require("./user");
const Accommodation = require("./accommodation");
const Bed = require('./bed');
const Configuration = require("./configuration");
const TourBooking = require("./tourBooking");
const Tour = require("./tour");

// associations

Accommodation.hasMany(AccommodationBooking);
Bed.hasMany(AccommodationBooking);
User.hasMany(AccommodationBooking);
Accommodation.hasMany(Bed);

AccommodationBooking.belongsTo(User);
AccommodationBooking.belongsTo(Accommodation);
AccommodationBooking.belongsTo(Bed);
Bed.belongsTo(Accommodation);

TourBooking.belongsTo(User);

module.exports = {
    AccommodationBooking,
    Accommodation,
    Bed,
    Tour,
    TourBooking,
    User,
    Configuration,
};
