export interface Delivery {
    id?: number;
    sub_order_id: number;
    livreur_id?: number;
    statut?: string;
    adresse_livraison: string;
    livreur_nom?: string;
    livreur_prenom?: string;
    client_nom?: string;
    client_prenom?: string;
    order_id?: number;
    created_at?: string;
}
