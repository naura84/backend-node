import express from "express";
import Order from "../models/Order.js";
import Book from "../models/Book.js";

const router = express.Router();

// 1. Création d'une commande
router.post("/", async (req, res) => {
    try {
        const { userId, items } = req.body;

        // Calcul automatique du montant total
        let total = 0;
        for (const item of items) {
            const book = await Book.findById(item.bookId);
            total += book.price * item.quantity;
        }

        const newOrder = await Order.create({
            userId,
            items,
            amount: total
        });

        res.status(201).json({
            message: "Commande créée avec succès",
            order: newOrder
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;

// 2. Lecture avec filtre
router.get("/", async (req, res) => {
    try {
        const { userId } = req.query;

        const filter = {};
        if (userId) filter.userId = userId;

        const orders = await Order.find(filter)
            .populate("userId", "name email")
            .populate("items.bookId", "title price");

        res.json({ count: orders.length, orders });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});