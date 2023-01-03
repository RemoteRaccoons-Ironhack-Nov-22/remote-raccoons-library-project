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

//LOGIN: display form
router.get('/login', (req, res) => res.render('auth/login'));


//LOGIN: process form
router.post("/login", (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.render('auth/login', { errorMessage: 'Please enter both, email and password to login.' });
        return;
    }

    User.findOne({ email: email })
        .then(userFromDB => {
            if (!userFromDB) {
                //user does not exist
                res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
                return;
            } else if (bcryptjs.compareSync(password, userFromDB.passwordHash)) {
                //login sucessful
                req.session.currentUser = userFromDB;
                res.render('users/user-profile', { userInSession: req.session.currentUser });
            } else {
                //login failed
                res.render('auth/login', { errorMessage: 'Incorrect credentials.' });
            }
        })
        .catch(error => {
            console.log("Error trying to login", error)
            next(error);
        });
});


router.get('/user-profile', (req, res) => {
    console.log(req.session.currentUser)
    res.render('users/user-profile', { userInSession: req.session.currentUser });
});



module.exports = router;