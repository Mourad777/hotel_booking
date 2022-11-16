const router = require("express").Router();
const { AccommodationBooking, Image, Accommodation, Amenity } = require("../../db/models");
const moment = require('moment');
const { Op } = require("sequelize");
const { deleteFiles } = require("../../utils");

router.get("/:accommodationId", async (req, res, next) => {
    const accommodationId = req.params.accommodationId;

    try {
        const accommodation = await Accommodation.findOne({
            where: { id: accommodationId },
            include: [
                { model: AccommodationBooking, order: ["createdAt", "DESC"] },
                { model: Image, order: ["createdAt", "DESC"] },
                { model: Amenity, order: ["createdAt", "DESC"] },
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
                ],
            });

            return res.json(accommodations)
        }

        const accommodations = await Accommodation.findAll({
            include: [
                { model: AccommodationBooking, order: ["createdAt", "DESC"] },
                { model: Image, order: ["createdAt", "DESC"] },
                { model: Amenity, order: ["createdAt", "DESC"] },
            ],

        });

        const momentCheckinDate = moment(checkinDate);
        const momentCheckoutDate = moment(checkoutDate);

        const unavailableAccommodations = []

        accommodations.forEach(accommodation => {
            accommodation.accommodation_bookings.forEach(booking => {
                const momentBookingStart = moment(booking.bookingStart);
                const momentBookingEnd = moment(booking.bookingEnd);
                const isDatesOccupied = (momentCheckinDate.isBetween(momentBookingStart, momentBookingEnd)) ||
                    (momentCheckoutDate.isBetween(momentBookingStart, momentBookingEnd))
                if (isDatesOccupied) {
                    unavailableAccommodations.push(accommodation.id);
                }
            })
        });

        const filteredAvailableAccommodations = accommodations.filter(accommodation=>{
            if(unavailableAccommodations.includes(accommodation.id)) {
                return false;
            } else return true
        })

        const rawAvailableAccommodations = filteredAvailableAccommodations.map(accommodation => accommodation.dataValues)
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
        ],
    });

    return res.json(accommodations);
})

router.post("/", async (req, res, next) => {
    const { images: imageIds, amenities } = req.body



    try {
        const newAccommodation = await Accommodation.create({ ...req.body, imagesOrder: imageIds });

        if (imageIds.length > 0) {
            await newAccommodation.addImages(imageIds)
        }

        await newAccommodation.addAmenities(amenities)
        res.json(newAccommodation);
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
        ],
        raw: false,
    });

    const currentAmenities = accommodation.amenities;
    const currentImages = accommodation.images;

    accommodation.title = title;
    accommodation.description = description;
    accommodation.capacity = capacity;
    accommodation.price = price;
    accommodation.type = type;
    accommodation.imagesOrder = newImages;

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

    try {
        await deleteFiles(urlsToDelete)
        await accommodation.removeImages(currentImages)
        await accommodation.addImages(newImages)
        await accommodation.removeAmenities(currentAmenities)
        await accommodation.addAmenities(newAmenities)
        await accommodation.save();
        res.send({accommodation})
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

        res.send({ deleteResult })
    } catch (error) {
        next(error);
        res.send({ error })
    }
});

module.exports = router;