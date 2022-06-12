const router = require("express").Router();
const { Image } = require("../../db/models");

router.post("/", async (req, res, next) => {
    try {

        const newImage = await Image.create(req.body);

        res.json({ newImage })

    } catch (error) {
        next(error);
    }
});

router.delete("/", async (req, res, next) => {

    const imageId = req.params.imageId;

    try {

        await Image.delete(imageId);

        res.json({ message: `image ${imageId} deleted` })

    } catch (error) {
        next(error);
    }
});

module.exports = router;