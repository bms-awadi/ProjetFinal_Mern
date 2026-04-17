export interface OrderItem {
    id?: number;
    sub_order_id?: number;
    product_id: number;
    quantite: number;
    prix_unitaire: number;
    sous_total: number;
    product_nom?: string;
}

export interface DeliveryInfo {
    id?: number;
    statut?: string;
    livreur_nom?: string;
    livreur_prenom?: string;
    adresse_livraison?: string;
}

export interface SubOrder {
    id?: number;
    order_id?: number;
    vendeur_id?: number;
    vendeur_nom?: string;
    vendeur_prenom?: string;
    statut?: string;
    sous_total: number;
    items?: OrderItem[];
    delivery?: DeliveryInfo;
}

export interface Order {
    id?: number;
    client_id?: number;
    client_nom?: string;
    client_prenom?: string;
    statut?: string;
    total: number;
    commission?: number;
    created_at?: string;
    sub_orders?: SubOrder[];
}

export interface CartItemPayload {
    product_id: number;
    quantite: number;
}

// Keep Commande for backward compat
export type Commande = Order;
