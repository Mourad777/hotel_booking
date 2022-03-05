const db = require("./db");
const { User } = require("./models");
const { Accommodation } = require("./models");
const { Configuration } = require("./models");

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
        type: 'privateRoom',
        capacity: 4,
        isRefrigerator: true,
        isPetsAllowed: false,
        isWifi: true,
        image:'/hotel-rooms/bedroom-gb8c0d4db8_640.jpg'
    });

    await Accommodation.create({
        type: 'apartment',
        capacity: 6,
        isRefrigerator: true,
        isPetsAllowed: true,
        isWifi: true,
        image:'/hotel-rooms/hotel-g1f6091865_640.jpg'
    });

    await Accommodation.create({
        type: 'house',
        capacity: 10,
        isRefrigerator: true,
        isPetsAllowed: true,
        isWifi: true,
        image:'/hotel-rooms/hotel-g8a8ee587a_640.jpg'
    });

    await Accommodation.create({
        type: 'dorm',
        bedNumber:1,
        capacity: 10,
        roomId:2,
        isRefrigerator: true,
        isPetsAllowed: true,
        isWifi: true,
        image:'/hotel-rooms/hotel-g8a8ee587a_640.jpg'
    });

    await Accommodation.create({
        type: 'dorm',
        bedNumber:3,
        roomId:2,
        capacity: 10,
        isRefrigerator: true,
        isPetsAllowed: true,
        isWifi: true,
        image:'/hotel-rooms/hotel-g8a8ee587a_640.jpg'
    });

    await Configuration.create({
        bookingPaymentRequired: true,
    });


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
