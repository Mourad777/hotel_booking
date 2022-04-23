const router = require("express").Router();
const { Amenity } = require("../../db/models");

router.get("/", async (req, res, next) => {
    try {

    const amenities = await Amenity.findAll();

    res.json(amenities)

    } catch (error) {
        next(error);
    }
});

module.exports = router;