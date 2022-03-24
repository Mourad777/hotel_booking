const { User } = require("../../db/models");
const router = require("express").Router();

router.get("/", async (req, res, next) => {

    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        next(error);
    }
});

module.exports = router;