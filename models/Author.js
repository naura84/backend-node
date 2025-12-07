// /models/Author.js
import mongoose from 'mongoose';
const { Schema } = mongoose;

const AuthorSchema = new Schema({
    name: { 
        type: String, 
        required: [true, 'Le nom de l\'auteur est requis.'], 
        trim: true 
    },
    bio: { 
        type: String 
    },
    nationality: { 
        type: String, 
        trim: true 
    },
    birthDate: { 
        type: Date 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

export default mongoose.model('Author', AuthorSchema);