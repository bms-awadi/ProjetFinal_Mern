import mongoose, { Document, Schema } from 'mongoose';

export interface IAdherent extends Document {
    nom: string;
    prenom: string;
    role: string;
    mdp: string;
    email: string;
}

const AdherentSchema: Schema = new Schema({
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    role: { type: String, required: true },
    mdp: { type: String, required: true },
    email: { type: String, required: true, unique: true }
}, {
    timestamps: true,
});

export default mongoose.model<IAdherent>('Adherent', AdherentSchema);