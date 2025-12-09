// index.js (Version Finale Corrigée)

import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
// --- 1. Importer les middlewares UNE SEULE FOIS ---
import { notFound, errorHandler } from './middlewares/errorMiddleware.js';

// Import des modules de routes
import bookRoutes from './routes/bookRoutes.js';
import authorRoutes from './routes/authorRoutes.js';
import articlesRoutes from "./routes/articlesRoutes.js";


// --- 1. Configuration et Variables d'Environnement ---
dotenv.config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;


// --- 2. Connexion à la Base de Données Mongoose ---
async function connectDB() {
    if (!MONGO_URI) {
        console.error("Erreur: MONGO_URI non défini dans le fichier .env");
        process.exit(1);
    }
    try {
        await mongoose.connect(MONGO_URI);
        console.log(`✅ MongoDB connecté avec succès.`);
    } catch (error) {
        console.error(`❌ Erreur de connexion MongoDB: ${error.message}`);
        process.exit(1);
    }
}

connectDB();


// --- 3. Initialisation de l'Application Express ---
const app = express();

// Middlewares généraux (doivent être AVANT les routes)
app.use(express.json()); // Pour analyser le corps des requêtes JSON
app.use(express.urlencoded({ extended: true }));


// --- 4. Définition des Routes de l'API ---

// Route de base de test
app.get('/', (req, res) => {
    res.send('API Bibliothèque Numérique fonctionnelle!');
});

// Connexion des routes spécifiques au projet
app.use('/api/authors', authorRoutes);
app.use('/api/books', bookRoutes);


// --- 5. Middlewares de Gestion des Erreurs (DOIVENT être les derniers) ---

// 1. Middleware 404 (pour toutes les routes non trouvées)
app.use(notFound); 

// 2. Middleware de gestion d'erreurs global (gère toutes les erreurs passées via next(err))
app.use(errorHandler);


// --- 6. Démarrage du Serveur ---
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port http://localhost:${PORT}`);
    console.log(`   (Mode: ${process.env.NODE_ENV || 'development'})`);
});
