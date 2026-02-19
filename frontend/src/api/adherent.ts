const API_BASE = 'http://localhost:3001/api';
const _HEADER = {
    'Content-Type': 'application/json',
};
import { Adherent } from '../model/adherent';

export const getAdherents = async (): Promise<Adherent[]> => {
    try {
        const response = await fetch(`${API_BASE}/adherents`);
        if (!response.ok) {
            throw new Error('Échec du chargement des adhérents');
        }
        return response.json();
    } catch (error) {
        console.error('Erreur lors du chargement des adhérents :', error);
        throw error;
    }
};

export const getAdherentById = async (id: number): Promise<Adherent> => {
    try {
        const response = await fetch(`${API_BASE}/adherents/${id}`);
        if (!response.ok) {
            throw new Error(`Échec du chargement de l’adhérent avec l’ID ${id}`);
        }
        return response.json();
    } catch (error) {
        console.error(`Erreur lors du chargement de l’adhérent avec l’ID ${id} :`, error);
        throw error;
    }
};

export const createAdherent = async (adherent: Adherent): Promise<Adherent> => {
    try {
        const response = await fetch(`${API_BASE}/adherents`, {
            method: 'POST',
            headers: _HEADER,
            body: JSON.stringify(adherent),
        });
        if (!response.ok) {
            throw new Error('Échec de la création de l’adhérent');
        }
        return response.json();
    } catch (error) {
        console.error('Erreur lors de la création de l’adhérent :', error);
        throw error;
    }
};

export const updateAdherent = async (id: number, adherent: Adherent): Promise<Adherent> => {
    try {
        const response = await fetch(`${API_BASE}/adherents/${id}`, {
            method: 'PUT',
            headers: _HEADER,
            body: JSON.stringify(adherent),
        });
        if (!response.ok) {
            throw new Error(`Échec de la mise à jour de l’adhérent avec l’ID ${id}`);
        }
        return response.json();
    } catch (error) {
        console.error(`Erreur lors de la mise à jour de l’adhérent avec l’ID ${id} :`, error);
        throw error;
    }
};

export const deleteAdherent = async (id: number): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE}/adherents/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Échec de la suppression de l’adhérent avec l’ID ${id}`);
        }
    } catch (error) {
        console.error(`Erreur lors de la suppression de l’adhérent avec l’ID ${id} :`, error);
        throw error;
    }
};
