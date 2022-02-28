const router = require("express").Router();
const { User } = require("../../db/models");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res, next) => {
    try {

        //check if there is a user in the database
        //if there isn't the first user will be the admin by default
        //if there is a user that means there is already an admin and
        //that the registered user is a client making a reservation

        // expects {username, email, password} in req.body
        const { firstName, lastName, password, email } = req.body;
        console.log('req.body',req.body)
        const existingUser = await User.findOne();

        console.log('existing user: ', existingUser);

        let isAdmin = true;
        if (existingUser) {
            isAdmin = false
        }

        const existingUserWithEmail = await User.findOne({
            where: { email: email },
        });

        if (existingUserWithEmail) {
            return res
                .status(400)
                .json({ error: "The e-mail is already in use" });
        }

        if (!firstName || !lastName || !password || !email) {
            return res
                .status(400)
                .json({ error: "First name, last name, password, and email required" });
        }

        if (password.length < 6) {
            return res
                .status(400)
                .json({ error: "Password must be at least 6 characters" });
        }

        console.log('creating')

        const user = await User.create({...req.body,isAdmin});

        const token = jwt.sign(
            { id: user.dataValues.id },
            process.env.SESSION_SECRET,
            { expiresIn: 86400 }
        );

        console.log('token: ',token)

        res.json({
            ...user.dataValues,
            token,
        });

    } catch (error) {
        if (error.name === "SequelizeUniqueConstraintError") {
            return res.status(401).json({ error: "User already exists" });
        } else if (error.name === "SequelizeValidationError") {
            return res.status(401).json({ error: "Validation error" });
        } else next(error);
    }
});

module.exports = router;