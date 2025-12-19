import express from 'express';
const router = express.Router();
import { 
    createOrder, 
    getOrders, 
    getUserSpendingStats 
} from '../controllers/orderController.js';

// POST /api/orders -> Créer une commande
router.post('/', createOrder);

// GET /api/orders -> Lire les commandes (ex: /api/orders?userId=ID_ICI)
router.get('/', getOrders);

// GET /api/orders/stats -> Agrégation dépenses utilisateurs
router.get('/stats', getUserSpendingStats);

export default router;