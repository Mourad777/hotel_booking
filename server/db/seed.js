const db = require("./db");
const { User, Bed, Tour } = require("./models");
const { Accommodation } = require("./models");
const { Configuration } = require("./models");
const Amenity = require("./models/amenity");

const amenities = ['Wifi', 'Pets', 'Lockers', 'Children allowed', 'Breakfast', 'Laundry', 'Dorm', 'Luggage storage', 'Bar', 'Meals', 'Common Area', 'Terrace', 'Smoking Area'];

async function seed() {
    await db.sync({ force: true });
    console.log("db synced!");

    await User.create({
        firstName: "Thomas",
        lastName: "Edisson",
        email: "thomas@email.com",
        password: "123456",
        isAdmin: true,
    });

    await User.create({
        firstName: "Robert",
        lastName: "Santiago",
        email: "robert@email.com",
        password: "123456",
        isAdmin: false,
    });

    await Accommodation.create({
        title: 'A cozy room inside a quiet guest house',
        description: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
        type: 'Private room',
        capacity: 4,
        isRefrigerator: true,
        isPetsAllowed: false,
        isWifi: true,
        imagesOrder: [1],
        images: ['/hotel-rooms/bedroom-gb8c0d4db8_640.jpg'],
        price: 40,
        isDraft: false,
    });

    await Accommodation.create({
        title: 'A new apartment in soho',
        description: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        type: 'Apartment',
        capacity: 6,
        isRefrigerator: true,
        isPetsAllowed: true,
        isWifi: true,
        imagesOrder: [1],
        images: ['/hotel-rooms/hotel-g1f6091865_640.jpg'],
        price: 55,
        isDraft: false,

    });

    await Accommodation.create({
        title: 'A little house by a beautiful lake',
        description: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        type: 'House',
        capacity: 10,
        isRefrigerator: true,
        isPetsAllowed: true,
        isWifi: true,
        imagesOrder: [1],
        images: ['/hotel-rooms/hotel-g8a8ee587a_640.jpg'],
        price: 120,
        isDraft: false,
    });

    const dorm1 = await Accommodation.create({
        title: 'A bed in a 6 bed mixed dorm',
        description: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        type: 'Dorm',
        bedNumber: 1,
        capacity: 10,
        roomId: 2,
        isRefrigerator: true,
        isPetsAllowed: true,
        isWifi: true,
        imagesOrder: [1, 2],
        images: ['/hotel-rooms/hotel-g8a8ee587a_640.jpg', '/hotel-rooms/hotel-g1f6091865_640.jpg'],
        price: 12,
        isDraft: false,
    });

    await Bed.create({
        isBunkbed: true,
        accommodationId: 4,
        bunkbedLevel: 1,
        accommodationId: dorm1.id,
    });

    await Bed.create({
        isBunkbed: true,
        accommodationId: 4,
        bunkbedLevel: 2,
        accommodationId: dorm1.id,
    });


    await Bed.create({
        isBunkbed: true,
        accommodationId: 4,
        bunkbedLevel: 1,
        accommodationId: dorm1.id,
    });

    await Bed.create({
        isBunkbed: true,
        accommodationId: 2,
        accommodationId: dorm1.id,
    });

    await Tour.create({
        type: 'Boat tour',
        title: 'Half day catamaran trip in the San Blas islands',
        capacity: 10,
        duration: 10,
        timeSlots: [12, 14],
        price: 30,
        isDraft: false,
    });

    await Configuration.create({
        bookingPaymentRequired: true,
    });

    await Promise.all(amenities.map(async amenity => {
        await Amenity.create({
            name:amenity
        });

    }))

}
async function runSeed() {
    console.log("seeding...");
    try {
        await seed();
    } catch (err) {
        console.error(err);
        process.exitCode = 1;
    } finally {
        console.log("closing db connection");
        await db.close();
        console.log("db connection closed");
    }
}

if (module === require.main) {
    runSeed();
}



// type: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   title: {
//     type: Sequelize.STRING,
//     allowNull: false,
//   },
//   description: {
//     type: Sequelize.STRING,
//     allowNull: true,
//   },
//   capacity: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//   },
//   image: {
//     type: Sequelize.STRING,
//     allowNull: true,
//   },
//   duration: {
//     type: Sequelize.INTEGER,
//     allowNull: false,
//   },
//   timeSlots: {
//     type: [Sequelize.INTEGER],
//     allowNull: false,
//   }