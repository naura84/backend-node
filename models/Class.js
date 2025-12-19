import mongoose from 'mongoose';
const { Schema } = mongoose;

const ClassSchema = new Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    level: { 
        type: String, 
        required: true 
    },
    professor: { 
        type: String, 
        required: true 
    }
});

export default mongoose.model('Class', ClassSchema);