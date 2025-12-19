// /models/Book.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const BookSchema = new Schema({
    title: { 
        type: String, 
        required: [true, 'Le titre du livre est requis.'], 
        unique: true, 
        trim: true 
    },
    price: { 
        type: Number, 
        required: [true, 'Le prix est requis pour passer commande'],
        min: 0 
    },
    isbn: { 
        type: String, 
        required: [true, 'L\'ISBN est requis.'], 
        unique: true
    },
    // RELATION: Référence à la collection 'Author' (obligatoire)
    authors: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Author', 
        required: true 
    }],
    publisher_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'Publisher', 
        required: true 
    },
    category_ids: [{ 
        type: Schema.Types.ObjectId, 
        ref: 'Category' 
    }],
    publicationDate: { 
        type: Date 
    },
    language: { 
        type: String, 
        required: true 
    },
    // Ajout d'un index pour la recherche textuelle (pour l'exigence 2)
    summary: { 
        type: String 
    },
});

// Créer un index textuel pour la recherche rapide
BookSchema.index({ title: 'text', summary: 'text' });

export default mongoose.model('Book', BookSchema);