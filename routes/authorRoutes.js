// /routes/authorRoutes.js
import express from 'express';
import { createAuthor } from '../controllers/authorController.js';

const router = express.Router();

// Exigence 1 : Route POST
router.post('/', createAuthor);

export default router;