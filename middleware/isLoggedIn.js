const isLoggedIn = (req, res, next) => {
    if (req.session.currentUser) {
        next(); // keep calling the next middleware
    } else {
        res.redirect("/login"); // send the user to the login page
    }
}

module.exports = isLoggedIn;