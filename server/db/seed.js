const db = require("./db");
const { User, Bed, Tour } = require("./models");
const { Configuration } = require("./models");
const Amenity = require("./models/amenity");

const amenities = ['Wifi', 'Patio', 'Laundry', 'Parking', 'Breakfast', 'Cooking Essentials', 'Hot Water', 'Towels'];

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
