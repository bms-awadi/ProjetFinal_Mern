const API_BASE = import.meta.env.VITE_API_URL as string;
// const API_BASE = 'http://localhost:3001/api';
const _HEADER = {
    'Content-Type': 'application/json',
};
import { Commande } from '../model/commande';

export const getCommandes = async (): Promise<Commande[]> => {
    try {
        const response = await fetch(`${API_BASE}/commandes`);
        if (!response.ok) {
            throw new Error(`Échec du chargement des commandes ! Statut : ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error('Erreur lors du chargement des commandes :', error);
        throw error;
    }
}

export const createCommande = async (commande: Commande): Promise<Commande> => {
    try {
        const response = await fetch(`${API_BASE}/commandes`, {
            method: 'POST',
            headers: _HEADER,
            body: JSON.stringify(commande),
        });
        if (!response.ok) {
            throw new Error(`Échec de la création de la commande ! Statut : ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error('Erreur lors de la création de la commande :', error);
        throw error;
    }
}

export const deleteCommande = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE}/commandes/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Échec de la suppression de la commande avec l’ID ${id} ! Statut : ${response.status}`);
        }
    } catch (error) {
        console.error(`Erreur lors de la suppression de la commande avec l’ID ${id} :`, error);
        throw error;
    }
}
