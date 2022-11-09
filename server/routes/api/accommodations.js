const router = require("express").Router();
const { AccommodationBooking, Image, Accommodation, Bed, Amenity } = require("../../db/models");
const moment = require('moment');
const { Op } = require("sequelize");
const { deleteFiles } = require("../../utils");

function isEmpty(obj) {
    return Object.keys(obj).length === 0;
}

router.get("/:accommodationId", async (req, res, next) => {
    const accommodationId = req.params.accommodationId;

    try {
        const accommodation = await Accommodation.findOne({
            where: { id: accommodationId },
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

        });

        const momentCheckinDate = moment(checkinDate);
        const momentCheckoutDate = moment(checkoutDate);

        const availableAccommodations = [];

        accommodations.forEach(accommodation => {
            if (accommodation.accommodation_bookings.length === 0) {
                availableAccommodations.push(accommodation)
                return
            }

            accommodation.accommodation_bookings.forEach(booking => {

                const momentBookingStart = moment(booking.bookingStart);
                const momentBookingEnd = moment(booking.bookingEnd);
                const isDatesOccupied = (momentCheckinDate.isBetween(momentBookingStart, momentBookingEnd)) ||
                    (momentCheckoutDate.isBetween(momentBookingStart, momentBookingEnd))
                if (!isDatesOccupied) {
                    if (
                        availableAccommodations.findIndex(acc => acc.id === accommodation.id) > -1
                    ) {
                        return
                    } else {
                        availableAccommodations.push(accommodation)
                        return
                    }
                }
            })




        });

        const rawAvailableAccommodations = availableAccommodations.map(accommodation => accommodation.dataValues)
        res.json(rawAvailableAccommodations)
    } catch (error) {
        next(error);
    }
});

router.get("/", async (req, res, next) => {
    const accommodations = await Accommodation.findAll({
        limit: 3, include: [
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

    return res.json(accommodations);
})

router.post("/", async (req, res, next) => {
    const { images: imageIds, amenities, beds: bedCount } = req.body



    try {
        const newAccommodation = await Accommodation.create({ ...req.body, imagesOrder: imageIds });

        if (imageIds.length > 0) {
            await newAccommodation.addImages(imageIds)
        }

        await newAccommodation.addAmenities(amenities)
        res.json(newAccommodation);
        // if (req.body.type === 'Dorm') {

        //     const emptyArrayBedCount = Array.from({ length: bedCount });

        //     await Promise.all(emptyArrayBedCount.map(async element => {
        //         await Bed.create({ isBunkbed: false, accommodationId: newAccommodation.id })
        //     }))
        // }
    } catch (error) {
        next(error);
    }
});

router.put("/update/:id", async (req, res, next) => {

    const { title, description, capacity, price, type, images: newImages, amenities: newAmenities } = req.body;
    const accommodationId = req.params.id;
    const accommodation = await Accommodation.findOne({
        where: { id: accommodationId },
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
        raw: false,
    });

    const currentAccommodationType = accommodation.type;
    const newAccommodationType = req.body.type;
    const currentNumberOfBeds = accommodation.beds.length;
    const newNumberOfBeds = req.body.beds;

    //if previous accommodation type was dorm and now is not dorm, delete all associated beds and cascade the bookings
    if (currentAccommodationType === 'Dorm' && newAccommodationType !== 'Dorm') {
        await Bed.destroy({
            where: {
                accommodationId
            },

        })

    }
    //if previous accommodation type was not dorm and now is dorm, create beds
    if (currentAccommodationType !== 'Dorm' && newAccommodationType === 'Dorm') {
        const bedsToCreate = newNumberOfBeds - currentNumberOfBeds;
        const emptyArrayBedCount = Array.from({ length: bedsToCreate });

        await Promise.all(emptyArrayBedCount.map(async element => {
            await Bed.create({ isBunkbed: false, accommodationId })
        }))

    }


    //if previous accommodation type was dorm and is still dorm but number of beds increased create beds
    if (currentAccommodationType === 'Dorm' && newAccommodationType === 'Dorm' && (currentNumberOfBeds < newNumberOfBeds)) {


    }

    const currentAmenities = accommodation.amenities;
    const currentImages = accommodation.images;

    accommodation.title = title;
    accommodation.description = description;
    accommodation.capacity = capacity;
    accommodation.price = price;
    accommodation.type = type;
    accommodation.imagesOrder = newImages;

    //find out if images have been deleted
    const currentImagesIds = currentImages.map(image => image.id);
    const deletedImages = currentImagesIds.filter(imageId => !newImages.includes(imageId));

    const imagesToDelete = await Image.findAll({
        where: {
            id: {
                [Op.in]: deletedImages
            },
        }
    });

    const urlsToDelete = imagesToDelete.map(image => image.url)

    await deleteFiles(urlsToDelete)

    //any way to update associations as a single command?
    await accommodation.removeImages(currentImages)
    await accommodation.addImages(newImages)

    await accommodation.removeAmenities(currentAmenities)
    await accommodation.addAmenities(newAmenities)



    // accommodation.amenities
    await accommodation.save();

    try {

    } catch (error) {
        next(error);
    }
});

router.delete("/delete/:accommodationId", async (req, res, next) => {
    const accommodationId = req.params.accommodationId;

    try {
        const deleteResult = await Accommodation.destroy({
            where: {
                id: accommodationId
            },

        })

        res.send({deleteResult})
    } catch (error) {
        next(error);
        res.send({error})
    }
});

module.exports = router;