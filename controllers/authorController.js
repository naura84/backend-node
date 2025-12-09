// /controllers/authorController.js
import Author from '../models/Author.js';
import validator from 'validator'; 

// Exigence 1 : Route d'écriture (POST)
export const createAuthor = async (req, res, next) => {
    const { name, bio, nationality, birthDate } = req.body;

    // 1. Validation des données avec ValidatorJS
    if (!name || validator.isEmpty(name.trim())) {
        res.status(400);
        return next(new Error('Le nom de l\'auteur est obligatoire.'));
    }

    try {
        const newAuthor = await Author.create({
            name: name.trim(),
            bio,
            nationality,
            birthDate: birthDate ? new Date(birthDate) : undefined
        });

        res.status(201).json({ 
            success: true, 
            data: newAuthor,
            message: "Auteur créé et validé avec succès."
        });
    } catch (error) {
        // Envoie l'erreur (ex: Mongoose validation error) au middleware global
        next(error); 
    }
};

// ... autres fonctions CRUD pour Author
