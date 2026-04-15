import { API_BASE, authHeader } from './config';
import { Produit } from '../model/produit';

export const getProduits = async (): Promise<Produit[]> => {
    const response = await fetch(`${API_BASE}/products`);
    if (!response.ok) throw new Error('Echec du chargement des produits');
    return response.json();
};

export const getProduitById = async (id: number): Promise<Produit> => {
    const response = await fetch(`${API_BASE}/products/${id}`);
    if (!response.ok) throw new Error('Produit non trouve');
    return response.json();
};

export const getProduitsVendeur = async (): Promise<Produit[]> => {
    const response = await fetch(`${API_BASE}/products/vendeur/me`, { headers: authHeader() });
    if (!response.ok) throw new Error('Echec');
    return response.json();
};

export const getCategories = async (): Promise<{ id: number; nom: string }[]> => {
    const response = await fetch(`${API_BASE}/products/categories`);
    if (!response.ok) throw new Error('Echec');
    return response.json();
};

export const createProduit = async (produit: Partial<Produit>): Promise<Produit> => {
    const response = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: authHeader(),
        body: JSON.stringify(produit),
    });
    if (!response.ok) throw new Error('Echec de la creation du produit');
    return response.json();
};

export const updateProduit = async (id: number, produit: Partial<Produit>): Promise<Produit> => {
    const response = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify(produit),
    });
    if (!response.ok) throw new Error('Echec de la mise a jour du produit');
    return response.json();
};

export const deleteProduit = async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
        headers: authHeader(),
    });
    if (!response.ok) throw new Error('Echec de la suppression du produit');
};
