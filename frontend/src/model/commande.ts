import { Adherent } from "./adherent";
import { Produit } from "./produit";

export interface Commande {
    _id?: string;
    adherent: Adherent;
    produit: Produit;
    quantite: number;
    date: Date;
}