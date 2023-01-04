const Book = require("../models/Book.model");
const Author = require("../models/Author.model");

const router = require("express").Router();

//READ: List all books
router.get("/books", (req, res, next) => {
    Book.find()
        .populate("author")
        .then(booksFromDB => {
            res.render("books/books-list", { books: booksFromDB })
        })
        .catch(err => {
            console.log("error getting books from DB", err);
            next(err);
        })
});


//CREATE: display form
router.get("/books/create", (req, res, next) => {
    Author.find()
        .then((authorsArr) => {
            res.render("books/book-create", { authorsArr });
        })
        .catch(err => {
            console.log("error getting authors from DB", err);
            next(err);
        })
});


//CREATE: process form
router.post("/books/create", (req, res, next) => {

    const bookDetails = {
        title: req.body.title,
        description: req.body.description,
        author: req.body.author,
        rating: req.body.rating,
    }

    Book.create(bookDetails)
        .then(bookDetails => {
            res.redirect("/books");
        })
        .catch(err => {
            console.log("error creating new book in DB", err);
            next();
        })

});


//READ: Book details
router.get("/books/:bookId", (req, res, next) => {
    const id = req.params.bookId;

    Book.findById(id)
        .populate("author")
        .then(bookDetails => {
            res.render("books/book-details", bookDetails);
        })
        .catch(err => {
            console.log("error getting book details from DB", err);
            next(err);
        })
});


//UPDATE: display form
router.get("/books/:bookId/edit", (req, res, next) => {

    let authorsArr;

    Author.find()
        .then( (authorsFromDB) => {
            authorsArr = authorsFromDB;
            return Book.findById(req.params.bookId)
        })
        .then((bookDetails) => {

            const data = {
                bookDetails,
                authorsArr
            };

            res.render("books/book-edit", data);
        })
        .catch(err => {
            console.log("Error getting book details from DB...", err);
            next();
        });
});


//UPDATE: process form
router.post("/books/:bookId/edit", (req, res, next) => {
    const bookId = req.params.bookId;

    const newDetails = {
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        rating: req.body.rating,
    }

    Book.findByIdAndUpdate(bookId, newDetails)
        .then(() => {
            res.redirect(`/books/${bookId}`);
        })
        .catch(err => {
            console.log("Error updating book...", err);
            next();
        });
});


//DELETE
router.post("/books/:bookId/delete", (req, res, next) => {
    Book.findByIdAndDelete(req.params.bookId)
        .then(() => {
            res.redirect("/books");
        })
        .catch(err => {
            console.log("Error deleting book...", err);
            next();
        });

});



module.exports = router;