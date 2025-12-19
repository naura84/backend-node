import Order from '../models/Order.js';
import Book from '../models/Book.js';
import User from '../models/User.js';

// 1. Route d'écriture : Créer une nouvelle commande
export const createOrder = async (req, res) => {
    try {
        const { userId, items } = req.body;

        // Calcul automatique du montant total en récupérant le prix de chaque livre
        let totalAmount = 0;
        for (const item of items) {
            const book = await Book.findById(item.bookId);
            if (!book) {
                return res.status(404).json({ message: `Livre avec l'ID ${item.bookId} non trouvé.` });
            }
            totalAmount += book.price * item.quantity; // Utilise le champ price de Book.js
        }

        const newOrder = new Order({
            userId,
            items,
            amount: totalAmount // Le montant est calculé et non juste fourni
        });

        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 2. Route de lecture : Récupérer les commandes avec filtre optionnel
export const getOrders = async (req, res) => {
    try {
        const { userId } = req.query;
        const filter = userId ? { userId } : {};

        const orders = await Order.find(filter)
            .populate('userId', 'name email') // Fusionne avec les infos utilisateur
            .populate('items.bookId', 'title price'); // Fusionne avec les infos des livres

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// 3. Agrégation avancée : Dépenses par utilisateur
export const getUserSpendingStats = async (req, res) => {
    try {
        const stats = await Order.aggregate([
            {
                // Étape 1 : Grouper par utilisateur et calculer la somme
                $group: {
                    _id: "$userId",
                    totalSpent: { $sum: "$amount" },
                    orderCount: { $sum: 1 },
                    orders: { $push: "$$ROOT" } // Conserve la liste des commandes
                }
            },
            {
                // Étape 2 : Fusionner avec la collection 'users'
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            { $unwind: "$userDetails" },
            {
                // Étape 3 : Structurer la réponse finale
                $project: {
                    _id: 0,
                    userName: "$userDetails.name",
                    totalSpent: 1,
                    orderCount: 1,
                    orders: 1
                }
            }
        ]);
        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};