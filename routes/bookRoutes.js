// /routes/bookRoutes.js
import express from 'express';
import { getBooksAdvanced, getTopAuthorsByBookCount } from '../controllers/bookController.js';

const router = express.Router();

// Exigence 2 : Route GET avancée
router.get('/', getBooksAdvanced);

// Exigence 3 : Route d'agrégation
router.get('/stats/top-authors', getTopAuthorsByBookCount);

export default router;