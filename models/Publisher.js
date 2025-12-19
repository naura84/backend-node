import mongoose from 'mongoose';
const { Schema } = mongoose;

const PublisherSchema = new Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    address: { 
        type: String 
    },
    website: { 
        type: String 
    }
});

export default mongoose.model('Publisher', PublisherSchema);