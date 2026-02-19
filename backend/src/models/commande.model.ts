import mongoose, { Document, Schema } from 'mongoose';

export interface ICommande extends Document {
    adherent: mongoose.Types.ObjectId;
    produit: mongoose.Types.ObjectId;
    quantite: number;
    date: Date;
}

const CommandeSchema: Schema = new Schema({
    adherent: { type: mongoose.Types.ObjectId, ref: 'Adherent', required: true },
    produit: { type: mongoose.Types.ObjectId, ref: 'Produit', required: true },
    quantite: { type: Number, required: true },
    date: { type: Date, default: Date.now },
}, {
    timestamps: true,
});

export default mongoose.model<ICommande>('Commande', CommandeSchema);