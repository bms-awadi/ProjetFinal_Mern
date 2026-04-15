export interface Produit {
    id?: number;
    nom: string;
    description?: string;
    categorie_id?: number;
    categorie_nom?: string;
    prix: number;
    stock: number;
    vendeur_id?: number;
    vendeur_nom?: string;
    vendeur_prenom?: string;
}
