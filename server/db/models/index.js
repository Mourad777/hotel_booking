const AccommodationBooking = require("./accommodationBooking");
const User = require("./user");
const Accommodation = require("./accommodation");
const Configuration = require("./configuration");
const TourBooking = require("./tourBooking");
const Tour = require("./tour");
const Amenity = require("./amenity");
const Image = require("./image");

// associations

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


Accommodation.hasMany(AccommodationBooking,
    {
        onDelete: 'cascade'
    });

User.hasMany(AccommodationBooking, {
    onDelete: 'cascade'
});
// Amenity.hasMany(Accommodation);
Accommodation.belongsToMany(Image, {
    through: 'accommodations_images',
    foreignKey: 'accommodation_id',
    otherKey: 'image_id',
    onDelete: 'cascade'
});

AccommodationBooking.belongsTo(User);
AccommodationBooking.belongsTo(Accommodation);

Image.belongsToMany(Accommodation, {
    through: 'accommodations_images',
    foreignKey: 'image_id',
    otherKey: 'accommodation_id',
    onDelete: 'cascade',
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
    Tour,
    TourBooking,
    User,
    Configuration,
    Amenity,
    Image,
};
