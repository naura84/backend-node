// routes/bookRoutes.js
import express from "express";
import Book from "../models/Book.js";
import Author from "../models/Author.js";

const router = express.Router();

router.post("/", async (req, res) => {
    try {
        const {
            title,
            isbn,
            authors,
            publisher_id,
            category_ids,
            publicationDate,
            language,
            summary
        } = req.body;

        // Vérifier que les auteurs existent
        const existingAuthors = await Author.find({ _id: { $in: authors } });
        if (existingAuthors.length !== authors.length) {
            return res.status(404).json({ message: "Un ou plusieurs auteurs n'existent pas." });
        }

        const newBook = await Book.create({
            title,
            isbn,
            authors,
            publisher_id,
            category_ids,
            publicationDate,
            language,
            summary,
        });

        res.status(201).json(newBook);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/", async (req, res) => {
    try {
        const books = await Book.find()
            .sort({ publicationDate: -1 })
            .populate("authors")
            .populate("publisher_id")
            .populate("category_ids");

        res.json(books);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get("/aggregation", async (req, res) => {
    try {
        const result = await Book.aggregate([
            { $unwind: "$authors" },

            {
                $lookup: {
                    from: "authors",
                    localField: "authors",
                    foreignField: "_id",
                    as: "authorInfo"
                }
            },

            { $unwind: "$authorInfo" },

            {
                $group: {
                    _id: "$authorInfo._id",
                    authorName: { $first: "$authorInfo.name" },
                    authorBio: { $first: "$authorInfo.bio" },
                    totalBooks: { $sum: 1 },
                    books: { $push: "$title" }
                }
            }
        ]);

        res.json(result);

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
