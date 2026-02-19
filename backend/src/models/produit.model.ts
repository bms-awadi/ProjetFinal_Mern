import mongoose, { Document, Schema } from 'mongoose';

export interface IProduit extends Document {
    nom: string;
    stock: number;
    categorie: string;
    prix: number;
}

const ProduitSchema: Schema = new Schema({
    nom: { type: String, required: true },
    stock: { type: Number, required: true },
    categorie: { type: String, required: true },
    prix: { type: Number, required: true }
}, {
    timestamps: true,
});

export default mongoose.model<IProduit>('Produit', ProduitSchema);