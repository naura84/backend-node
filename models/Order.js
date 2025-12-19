import mongoose from 'mongoose';
const { Schema } = mongoose;

const OrderSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User', // Assurez-vous d'avoir un modèle User ou adaptez le nom
        required: true
    },
    items: [{
        bookId: {
            type: Schema.Types.ObjectId,
            ref: 'Book', // Référence au modèle Book existant
            required: true
        },
        quantity: {
            type: Number,
            required: true,
            min: [1, 'La quantité ne peut pas être inférieure à 1']
        }
    }],
    amount: {
        type: Number,
        required: true,
        default: 0
    },
    status: {
        type: String,
        enum: ['En attente', 'Payée', 'Expédiée', 'Annulée'],
        default: 'En attente'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('Order', OrderSchema);