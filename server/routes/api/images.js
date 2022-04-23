const router = require("express").Router();
const { Image } = require("../../db/models");

router.post("/", async (req, res, next) => {
    const {accommodationId,tourId,url} = req.body
    console.log('req.body',req.body)
    try {

    const newImage = await Image.create(req.body);

    res.json({newImage})

    } catch (error) {
        next(error);
    }
});

module.exports = router;