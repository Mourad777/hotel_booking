const db = require("./db");
const { User } = require("./models");
const { Room } = require("./models");
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

    await Room.create({
        type: 'private room',
        capacity: 4,
        isRefrigerator: true,
        isPetsAllowed: false,
        isWifi: true,
    });

    await Room.create({
        type: 'Apartment',
        capacity: 6,
        isRefrigerator: true,
        isPetsAllowed: true,
        isWifi: true,
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
