const Book = require("../models/Book.model");
const Author = require("../models/Author.model");

const router = require("express").Router();

//READ: List all authors
router.get("/authors", (req, res, next) => {
    Author.find()
        .then(authors => {
            res.render("authors/authors-list", { authors });
        })
        .catch(err => {
            console.log('Error getting authors from DB...', err);
            next(err);
        })
});

module.exports = router;