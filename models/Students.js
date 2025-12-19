import mongoose from 'mongoose';
const { Schema } = mongoose;

const StudentSchema = new Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    age: { 
        type: Number, 
        required: true 
    },
    // La relation utilisée dans ton agrégation $lookup
    class_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'Class', 
        required: true 
    }
});

export default mongoose.model('Student', StudentSchema);