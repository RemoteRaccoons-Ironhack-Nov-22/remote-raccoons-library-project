const bcryptjs = require("bcryptjs");
const User = require("../models/User.model");

const router = require("express").Router();

const saltRounds = 10;

//SIGNUP: display form
router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});


//SIGNUP: process form
router.post("/signup", (req, res, next) => {

    const { email, password } = req.body;

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => {
            return bcryptjs.hash(password, salt)
        })
        .then((hash) => {
            const userDetails = {
                email,
                passwordHash: hash
            }

            return User.create(userDetails);
        })
        .then(userFromDB => {
            res.redirect("/");
        })
        .catch(e => {
            console.log("error creating user account", e)
            next(e);
        });
});


module.exports = router;