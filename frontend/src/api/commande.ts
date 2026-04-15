import { API_BASE, authHeader } from './config';
import { Order, CartItemPayload } from '../model/commande';

export const getMyOrders = async (): Promise<Order[]> => {
    const response = await fetch(`${API_BASE}/orders/me`, { headers: authHeader() });
    if (!response.ok) throw new Error('Echec du chargement des commandes');
    return response.json();
};

export const getAllOrders = async (): Promise<Order[]> => {
    const response = await fetch(`${API_BASE}/orders`, { headers: authHeader() });
    if (!response.ok) throw new Error('Echec du chargement des commandes');
    return response.json();
};

export const getOrderById = async (id: number): Promise<Order> => {
    const response = await fetch(`${API_BASE}/orders/${id}`, { headers: authHeader() });
    if (!response.ok) throw new Error('Commande non trouvee');
    return response.json();
};

export const createOrder = async (items: CartItemPayload[], adresse_livraison: string): Promise<Order> => {
    const response = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ items, adresse_livraison }),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Echec de la creation de la commande');
    }
    return response.json();
};

export const payOrder = async (orderId: number, methode: string = 'carte'): Promise<any> => {
    const response = await fetch(`${API_BASE}/orders/${orderId}/pay`, {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify({ methode }),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Echec du paiement');
    }
    return response.json();
};

export const getVendeurOrders = async (): Promise<any[]> => {
    const response = await fetch(`${API_BASE}/orders/vendeur/me`, { headers: authHeader() });
    if (!response.ok) throw new Error('Echec');
    return response.json();
};

export const getOrderStats = async (): Promise<any> => {
    const response = await fetch(`${API_BASE}/orders/stats`, { headers: authHeader() });
    if (!response.ok) throw new Error('Echec');
    return response.json();
};

export const getCommandes = getMyOrders;

export const deleteCommande = async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/orders/${id}`, {
        method: 'DELETE',
        headers: authHeader(),
    });
    if (!response.ok) throw new Error('Echec de la suppression');
};
