const router = require("express").Router();
const { AccommodationBooking, Image, Accommodation, Bed, Amenity } = require("../../db/models");
const moment = require('moment');

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

router.get("/:accommodationId", async (req, res, next) => {
    const accommodationId = req.params.accommodationId;

    try {
        const accommodation = await Accommodation.findOne({
            where: { id: accommodationId }, include: [
                { model: AccommodationBooking, order: ["createdAt", "DESC"] },
                { model: Image, order: ["createdAt", "DESC"] },
                { model: Amenity, order: ["createdAt", "DESC"] },
                {
                    model: Bed, order: ["createdAt", "DESC"], include: [
                        { model: AccommodationBooking, order: ["createdAt", "DESC"] },
                    ],
                },
            ],
        });
        res.json(accommodation);
    } catch (error) {
        next(error);
    }
});

router.get("/:checkin/:checkout", async (req, res, next) => {
    const checkinDate = req.params.checkin;
    const checkoutDate = req.params.checkout;

    try {

        if (checkinDate === 'all' && checkoutDate === 'all') {
            const accommodations = await Accommodation.findAll({
                include: [
                    { model: AccommodationBooking, order: ["createdAt", "DESC"] },
                    { model: Image, order: ["createdAt", "DESC"] },
                    { model: Amenity, order: ["createdAt", "DESC"] },
                    {
                        model: Bed, order: ["createdAt", "DESC"], include: [
                            { model: AccommodationBooking, order: ["createdAt", "DESC"] },
                        ],
                    },
                ],
                // raw: true,
                // nest: true,
                // rowMode: "array"
            });

            return res.json(accommodations)
        }

        const accommodations = await Accommodation.findAll({
            include: [
                { model: AccommodationBooking, order: ["createdAt", "DESC"] },
                { model: Image, order: ["createdAt", "DESC"] },
                { model: Amenity, order: ["createdAt", "DESC"] },
                {
                    model: Bed, order: ["createdAt", "DESC"], include: [
                        { model: AccommodationBooking, order: ["createdAt", "DESC"] },
                    ],
                },
            ],
            // raw: true,
            // nest: true,
            // rowMode: "array"
        });

        console.log('returning accoms', accommodations)

        // res.json(accommodations)




        console.log('query:', accommodations);

        const momentCheckinDate = moment(checkinDate);
        const momentCheckoutDate = moment(checkoutDate);

        console.log('momentCheckinDate', momentCheckinDate);
        console.log('momentCheckoutDate', momentCheckoutDate);

        const availableAccommodations = [];
        const availableBeds = [];

        accommodations.forEach(accommodation => {



            accommodation.beds.forEach(bed => {
                let isBedAvailable = true;

                if (bed.accommodation_bookings.length === 0) {
                    //if the bed has no booking we already know it is available for any date
                    availableBeds.push(bed)
                    return
                }

                bed.accommodation_bookings.forEach(booking => {

                    const momentBookingStart = moment(booking.bookingStart);
                    const momentBookingEnd = moment(booking.bookingEnd);
                    const isDatesOccupied = (momentCheckinDate.isBetween(momentBookingStart, momentBookingEnd)) ||
                        (momentCheckoutDate.isBetween(momentBookingStart, momentBookingEnd))

                    if (isDatesOccupied) {
                        isBedAvailable = false;
                        return
                    }
                })

                if (isBedAvailable) {
                    availableBeds.push(bed)
                }

            })

            let isAccommodationAvailable = true;

            if (accommodation.accommodation_bookings.length === 0) {
                //if the accommodation has no booking we already know it is available for any date

                availableAccommodations.push(accommodation)
                return
            }

            accommodation.accommodation_bookings.forEach(booking => {

                const momentBookingStart = moment(booking.bookingStart);
                const momentBookingEnd = moment(booking.bookingEnd);
                const isDatesOccupied = (momentCheckinDate.isBetween(momentBookingStart, momentBookingEnd)) ||
                    (momentCheckoutDate.isBetween(momentBookingStart, momentBookingEnd))

                if (isDatesOccupied) {
                    isAccommodationAvailable = false;
                    return
                }
            })

            if (isAccommodationAvailable) {
                availableAccommodations.push(accommodation)
            }

        });

        //get only data values from accommodations array
        const rawAvailableAccommodations = availableAccommodations.map(accommodation => accommodation.dataValues)
        const rawAvailableAccommodationsWithBeds = rawAvailableAccommodations.map(accommodation => {
            return { ...accommodation, beds: accommodation.beds.filter(bed => availableBeds.findIndex(availableBed => availableBed.accommodationId === bed.accommodationId) > -1) }
        })
        console.log('rawAvailableAccommodations', rawAvailableAccommodations);
        console.log('rawAvailableAccommodationsWithBeds', rawAvailableAccommodationsWithBeds)
        //since the available accomodations will include beds in dorm rooms and a bed is considered an accommodation, need to make sure that the 
        //list of accomodations doesn't included the same room twice but rather group the beds of the same room inside a nested array

        // const dormRooms = []


        // const sortedAvailableAccommodations = rawAvailableAccommodations.map(accommodation => {
        //     if (accommodation.roomId) {
        //         const roomIndex = dormRooms.findIndex(room => room.roomId === accommodation.roomId)
        //         const isRoomInList = roomIndex > -1
        //         if (isRoomInList) {
        //             dormRooms.push({ ...dormRooms[roomIndex], beds: [...dormRooms[roomIndex].beds, accommodation] })
        //             dormRooms.splice(roomIndex, 1);
        //         } else {
        //             //remove certain properties from accomodation object if its a dorm, as those properties are
        //             //already in the nested bed object, the user will book a bed and not the whole dorm room
        //             const accommodationClone = (({ bedNumber, bookings, capacity, ...o }) => o)(accommodation)
        //             dormRooms.push({ ...accommodationClone, beds: [accommodation] })
        //         }
        //         return null;
        //     } else {
        //         return {
        //             ...accommodation,

        //         }
        //     }
        // })

        // const accommodationsWithDorms = [...sortedAvailableAccommodations, ...dormRooms];
        // console.log('accommodationsWithDorms', accommodationsWithDorms)
        res.json(rawAvailableAccommodationsWithBeds)
        // res.json(accommodationsWithDorms.filter(accommodation => accommodation));
    } catch (error) {
        next(error);
    }
});

router.post("/", async (req, res, next) => {

    console.log('req.body', req.body)

    const newAccommodation = await Accommodation.create(req.body);

    const { images, amenities, beds: bedCount } = req.body

    const imagesToAdd = []

    if(images.length > 0) {
        await Promise.all(images.map(async image => {
           const newImage = await Image.create({ url:image.src })
           imagesToAdd.push(newImage.id)
        }))
    }

    if(imagesToAdd.length > 0 ) {
        await newAccommodation.addImages(imagesToAdd)
    }

    await newAccommodation.addAmenities(amenities)

    if (req.body.type === 'Dorm') {

        const emptyArrayBedCount = Array.from({ length: bedCount });

        await Promise.all(emptyArrayBedCount.map(async element => {
            await Bed.create({ isBunkbed: false, accommodationId: newAccommodation.id })
        }))

        // for (let i = 0; i < bedCount; i++) {
        //     await Bed.create({ isBunkBed: false, accommodationId: newAccommodation.id })
        // }
    }

    try {

    } catch (error) {
        next(error);
    }
});

router.put("/update", async (req, res, next) => {


    try {

    } catch (error) {
        next(error);
    }
});

router.delete("/delete", async (req, res, next) => {


    try {

    } catch (error) {
        next(error);
    }
});

module.exports = router;