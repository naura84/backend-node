// /controllers/bookController.js
import Book from '../models/Book.js';

// Exigence 2 : Route de lecture avancée (GET)
export const getBooksAdvanced = async (req, res, next) => {
    try {
        const { search, category, limit = 10, page = 1 } = req.query;

        // 1. Construction du filtre
        let queryFilter = {};

        // Recherche textuelle (utilise l'index défini dans le modèle)
        if (search) {
            queryFilter.$text = { $search: search };
        }
        
        // Filtrage par catégorie
        if (category) {
            // Assurez-vous que la catégorie est un ID valide ou gérez le nom de catégorie
            queryFilter.category_ids = category; 
        }

        // 2. Pagination
        const pageSize = parseInt(limit);
        const skip = (parseInt(page) - 1) * pageSize;
        
        const books = await Book.find(queryFilter)
                                .limit(pageSize)
                                .skip(skip)
                                // Jointure Mongoose pour charger les données de l'auteur
                                .populate('authors') 
                                .sort({ title: 1 });

        const totalCount = await Book.countDocuments(queryFilter);

        res.json({
            success: true,
            total: totalCount,
            page: parseInt(page),
            pages: Math.ceil(totalCount / pageSize),
            data: books
        });
    } catch (error) {
        next(error);
    }
};

// ... autres fonctions CRUD pour Book
// /controllers/bookController.js (suite)
// ... import Book, Author (si nécessaire) ...

// Exigence 3 : Route d'agrégation
export const getTopAuthorsByBookCount = async (req, res, next) => {
    try {
        // Le pipeline d'agrégation
        const pipeline = [
            // $unwind: Détache chaque auteur d'un livre en documents séparés
            { $unwind: '$authors' },
            
            // $group: Regroupe par auteur et compte le nombre de livres
            { $group: { 
                _id: '$authors', 
                bookCount: { $sum: 1 } 
            }},
            
            // $sort: Trie par le nombre de livres (du plus grand au plus petit)
            { $sort: { bookCount: -1 } },
            
            // $limit: Limite aux 5 premiers
            { $limit: 5 },
            
            // $lookup: Jointure pour obtenir les détails complets de l'auteur (Nom, Bio, etc.)
            { $lookup: {
                from: 'authors',          // Nom de la collection cible (en minuscules et pluriel par défaut)
                localField: '_id',        // Champ de jointure local (l'ID de l'auteur)
                foreignField: '_id',      // Champ de jointure distant
                as: 'authorDetails'       // Nom du champ résultat
            }},
            
            // $unwind: Pour aplatir le tableau 'authorDetails' (car _id est unique)
            { $unwind: '$authorDetails' },
            
            // $project: Mise en forme de la réponse
            { $project: {
                _id: 0,
                authorName: '$authorDetails.name',
                bookCount: 1,
                nationality: '$authorDetails.nationality'
            }}
        ];

        const topAuthors = await Book.aggregate(pipeline);

        res.json({
            success: true,
            message: "Top 5 des auteurs basés sur le nombre de livres.",
            data: topAuthors
        });

    } catch (error) {
        next(error);
    }
};