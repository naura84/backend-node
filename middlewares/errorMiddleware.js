// /middlewares/errorMiddleware.js (ES Module Syntax)

// 1. Middleware pour gérer les routes non trouvées (404 Not Found)
export const notFound = (req, res, next) => {
    // Crée une nouvelle erreur avec le statut 404
    const error = new Error(`Ressource non trouvée - ${req.originalUrl}`);
    res.status(404);
    next(error); // Passe l'erreur au gestionnaire d'erreurs général
};

// 2. Gestionnaire d'erreurs global (obligatoire)
export const errorHandler = (err, req, res, next) => {
    
    // Déterminer le statut: 200 => 500, sinon utilise le statut déjà défini
    const status = res.statusCode === 200 ? 500 : res.statusCode;
    const message = err.message || 'Erreur interne du serveur';

    // Log de l'erreur dans la console du serveur (pour le développeur)
    console.error(`[Erreur ${status}] ${message}`);

    // Si Mongoose ne trouve pas de ressource par ID (CastError)
    if (err.name === 'CastError' && err.kind === 'ObjectId') {
        res.status(404);
        err.message = 'Ressource introuvable (ID invalide)';
    }

    // Réponse envoyée au client
    res.status(status).json({
        success: false,
        status: status,
        message: err.message,
        // Inclut la pile d'appels (stack trace) uniquement en mode développement
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};