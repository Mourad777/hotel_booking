const AccommodationBooking = require("./accommodationBooking");
const User = require("./user");
const Accommodation = require("./accommodation");
const Bed = require('./bed');
const Configuration = require("./configuration");
const TourBooking = require("./tourBooking");
const Tour = require("./tour");
const Amenity = require("./amenity");
const Image = require("./image");

// associations

Accommodation.hasMany(AccommodationBooking);

// Accommodation.hasMany(Amenity);

Amenity.belongsToMany(Accommodation, {
    through: 'accommodations_amenities',
    foreignKey: 'amenity_id',
    otherKey: 'accommodation_id'
});

Accommodation.belongsToMany(Amenity, {
    through: 'accommodations_amenities',
    foreignKey: 'accommodation_id',
    otherKey: 'amenity_id'
});

Accommodation.hasMany(Bed);
Bed.hasMany(AccommodationBooking);
User.hasMany(AccommodationBooking);
// Amenity.hasMany(Accommodation);
Accommodation.belongsToMany(Image, {
    through: 'accommodations_images',
    foreignKey: 'accommodation_id',
    otherKey: 'image_id'
});

AccommodationBooking.belongsTo(User);
AccommodationBooking.belongsTo(Accommodation);
AccommodationBooking.belongsTo(Bed);
Bed.belongsTo(Accommodation);
Image.belongsToMany(Accommodation, {
    through: 'accommodations_images',
    foreignKey: 'image_id',
    otherKey: 'accommodation_id'
});
Image.belongsToMany(Tour, {
    through: 'tours_images',
    foreignKey: 'image_id',
    otherKey: 'tour_id'
});

Tour.belongsToMany(Image, {
    through: 'tours_images',
    foreignKey: 'tour_id',
    otherKey: 'image_id'
});

TourBooking.belongsTo(User);

module.exports = {
    AccommodationBooking,
    Accommodation,
    Bed,
    Tour,
    TourBooking,
    User,
    Configuration,
    Amenity,
    Image,
};
