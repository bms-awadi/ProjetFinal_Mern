const API_BASE = 'http://localhost:3001/api';
const _HEADER = {
    'Content-Type': 'application/json',
};
import { Produit } from '../model/produit';

export const getProduits = async (): Promise<Produit[]> => {
    try {
        const response = await fetch(`${API_BASE}/produits`);
        if (!response.ok) {
            throw new Error('Échec du chargement des produits');
        }
        return response.json();
    } catch (error) {
        console.error('Erreur lors du chargement des produits :', error);
        throw error;
    }
}

export const getProduitById = async (id: number): Promise<Produit> => {
    try {
        const response = await fetch(`${API_BASE}/produits/${id}`);
        if (!response.ok) {
            throw new Error(`Échec du chargement du produit avec l’ID ${id}`);
        }
        return response.json();
    } catch (error) {
        console.error(`Erreur lors du chargement du produit avec l’ID ${id} :`, error);
        throw error;
    }
}

export const createProduit = async (produit: Produit): Promise<Produit> => {
    try {
        const response = await fetch(`${API_BASE}/produits`, {
            method: 'POST',
            headers: _HEADER,
            body: JSON.stringify(produit),
        });
        if (!response.ok) {
            throw new Error('Échec de la création du produit');
        }
        return response.json();
    } catch (error) {
        console.error('Erreur lors de la création du produit :', error);
        throw error;
    }
}

export const updateProduit = async (id: number, produit: Produit): Promise<Produit> => {
    try {
        const response = await fetch(`${API_BASE}/produits/${id}`, {
            method: 'PUT',
            headers: _HEADER,
            body: JSON.stringify(produit),
        });
        if (!response.ok) {
            throw new Error(`Échec de la mise à jour du produit avec l’ID ${id}`);
        }
        return response.json();
    } catch (error) {
        console.error(`Erreur lors de la mise à jour du produit avec l’ID ${id} :`, error);
        throw error;
    }
}

export const deleteProduit = async (id: number): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE}/produits/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Échec de la suppression du produit avec l’ID ${id}`);
        }
    } catch (error) {
        console.error(`Erreur lors de la suppression du produit avec l’ID ${id} :`, error);
        throw error;
    }
}
