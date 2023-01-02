const Book = require("../models/Book.model");

const router = require("express").Router();

//READ: List all books
router.get("/books", (req, res, next) => {
    Book.find()
        .then(booksFromDB => {
            res.render("books/books-list", { books: booksFromDB })
        })
        .catch(err => {
            console.log("error getting books from DB", err);
            next();
        })
});


//READ: Book details
router.get("/books/:bookId", (req, res, next) => {
    const id = req.params.bookId;

    Book.findById(id)
        .then(bookDetails => {
            res.render("books/book-details", bookDetails);
        })
        .catch(err => {
            console.log("error getting book details from DB", err);
            next();
        })
});


//CREATE: display form
router.get("/books/create", (req, res, next) => {
    res.render("books/book-create");
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


//UPDATE: display form
router.get("/books/:bookId/edit", (req, res, next) => {
    Book.findById(req.params.bookId)
        .then((bookDetails) => {
            res.render("books/book-edit", bookDetails);
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