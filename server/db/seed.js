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
        title:'A cozy room inside a quiet guest house',
        description:'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.',
        type: 'Private room',
        capacity: 4,
        isRefrigerator: true,
        isPetsAllowed: false,
        isWifi: true,
        image:'/hotel-rooms/bedroom-gb8c0d4db8_640.jpg'
    });

    await Accommodation.create({
        title:'A new apartment in soho',
        description:'Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        type: 'Apartment',
        capacity: 6,
        isRefrigerator: true,
        isPetsAllowed: true,
        isWifi: true,
        image:'/hotel-rooms/hotel-g1f6091865_640.jpg',

    });

    await Accommodation.create({
        title:'A little house by a beautiful lake',
        description:'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
        type: 'House',
        capacity: 10,
        isRefrigerator: true,
        isPetsAllowed: true,
        isWifi: true,
        image:'/hotel-rooms/hotel-g8a8ee587a_640.jpg'
    });

    await Accommodation.create({
        title:'A bed in a 6 bed mixed dorm',
        description:'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        type: 'Dorm',
        bedNumber:1,
        capacity: 10,
        roomId:2,
        isRefrigerator: true,
        isPetsAllowed: true,
        isWifi: true,
        image:'/hotel-rooms/hotel-g8a8ee587a_640.jpg'
    });

    await Accommodation.create({
        title:'A bed in a 6 bed mixed dorm',
        description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        type: 'Dorm',
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
