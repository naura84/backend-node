import mongoose from 'mongoose';
const { Schema } = mongoose;

const CategorySchema = new Schema({
    label: { 
        type: String, 
        required: true, 
        unique: true,
        trim: true 
    },
    description: { 
        type: String 
    }
});

export default mongoose.model('Category', CategorySchema);