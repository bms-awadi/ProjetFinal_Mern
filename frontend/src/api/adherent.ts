import { API_BASE, _HEADER } from './config';
import { Adherent } from '../model/adherent';
import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'token';

const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);

/** Vérifie que le token existe et n'est pas expiré */
export const estConnecte = (): boolean => {
    const token = getToken();
    if (!token) return false;
    try {
        const { exp } = jwtDecode<{ exp: number }>(token);
        return Date.now() < exp * 1000;
    } catch {
        return false;
    }
};

/** Retourne le payload décodé du token (sans appel API) */
export const getAdherentConnecte = (): { id: string; nom: string, prenom: string, email: string, role: string } | null => {
    const token = getToken();
    if (!token) return null;
    try {
        const decoded = jwtDecode<{ id: string; email: string; nom: string, prenom: string; role: string; exp: number }>(token);
        if (Date.now() >= decoded.exp * 1000) return null; // expiré
        return { id: decoded.id, nom: decoded.nom, prenom: decoded.prenom, email: decoded.email, role: decoded.role };
    } catch {
        return null;
    }
};

// Auth
export const connexion = async (email: string, mdp: string): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE}/adherents/login`, {
            method: 'POST',
            headers: _HEADER,
            body: JSON.stringify({ email, mdp }),
        });

        if (!response.ok) throw new Error('Échec de la connexion');

        const { token } = await response.json();
        if (!token) throw new Error('Token manquant dans la réponse');

        localStorage.setItem(TOKEN_KEY, token);
    } catch (error) {
        console.error('Erreur lors de la connexion :', error);
        throw error;
    }
};

export const deconnexion = (): void => {
    localStorage.removeItem(TOKEN_KEY);
};

// CRUD adhérents 
export const getAdherents = async (): Promise<Adherent[]> => {
    try {
        const response = await fetch(`${API_BASE}/adherents`);
        if (!response.ok) throw new Error('Échec du chargement des adhérents');
        return response.json();
    } catch (error) {
        console.error('Erreur lors du chargement des adhérents :', error);
        throw error;
    }
};

export const getAdherentById = async (id: string): Promise<Adherent> => {
    try {
        const response = await fetch(`${API_BASE}/adherents/${id}`);
        if (!response.ok) throw new Error(`Échec du chargement de l'adhérent avec l'ID ${id}`);
        return response.json();
    } catch (error) {
        console.error(`Erreur lors du chargement de l'adhérent avec l'ID ${id} :`, error);
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
        if (!response.ok) throw new Error("Échec de la création de l'adhérent");
        return response.json();
    } catch (error) {
        console.error("Erreur lors de la création de l'adhérent :", error);
        throw error;
    }
};

export const updateAdherent = async (id: string, adherent: Adherent): Promise<Adherent> => {
    try {
        const response = await fetch(`${API_BASE}/adherents/${id}`, {
            method: 'PUT',
            headers: _HEADER,
            body: JSON.stringify(adherent),
        });
        if (!response.ok) throw new Error(`Échec de la mise à jour de l'adhérent avec l'ID ${id}`);
        return response.json();
    } catch (error) {
        console.error(`Erreur lors de la mise à jour de l'adhérent avec l'ID ${id} :`, error);
        throw error;
    }
};

export const deleteAdherent = async (id: string): Promise<void> => {
    try {
        const response = await fetch(`${API_BASE}/adherents/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) throw new Error(`Échec de la suppression de l'adhérent avec l'ID ${id}`);
    } catch (error) {
        console.error(`Erreur lors de la suppression de l'adhérent avec l'ID ${id} :`, error);
        throw error;
    }
};