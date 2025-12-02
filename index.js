// server.js (ou index.js)

import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { notFound, errorHandler } from './middlewares/errorMiddleware.js'; // Assurez-vous de créer ce fichier

// --- 1. Configuration et Variables d'Environnement ---
dotenv.config();

// Récupération des variables importantes du .env
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
        // Arrêter le processus si la connexion échoue
        process.exit(1);
    }
}

connectDB();

// --- 3. Initialisation de l'Application Express ---
const app = express();

// Middleware pour analyser le corps des requêtes JSON
app.use(express.json());

// Middleware pour gérer les données encodées par URL
app.use(express.urlencoded({ extended: true }));


// --- 4. Définition des Routes de l'API ---
// Importez et utilisez vos modules de routes ici
// Exemple :
// import bookRoutes from './routes/bookRoutes.js';
// import authorRoutes from './routes/authorRoutes.js';

// app.use('/api/books', bookRoutes);
// app.use('/api/authors', authorRoutes);

// Route de base de test
app.get('/', (req, res) => {
    res.send('API Bibliothèque Numérique fonctionnelle!');
});


// --- 5. Middlewares de Gestion des Erreurs (Obligatoires) ---
// Middleware 404 (pour toutes les routes non trouvées)
app.use(notFound); 

// Middleware de gestion d'erreurs global (Doit être le dernier)
app.use(errorHandler);


// --- 6. Démarrage du Serveur ---
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port http://localhost:${PORT}`);
    console.log(`   (Mode: ${process.env.NODE_ENV || 'development'})`);
});