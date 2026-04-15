import { API_BASE, _HEADER, authHeader } from './config';
import { User } from '../model/adherent';
import { jwtDecode } from 'jwt-decode';

const TOKEN_KEY = 'token';

const getToken = (): string | null => localStorage.getItem(TOKEN_KEY);

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

export const getAdherentConnecte = (): { id: number; nom: string; prenom: string; email: string; role: string } | null => {
    const token = getToken();
    if (!token) return null;
    try {
        const decoded = jwtDecode<{ id: number; email: string; nom: string; prenom: string; role: string; exp: number }>(token);
        if (Date.now() >= decoded.exp * 1000) return null;
        return { id: decoded.id, nom: decoded.nom, prenom: decoded.prenom, email: decoded.email, role: decoded.role };
    } catch {
        return null;
    }
};

export const connexion = async (email: string, password: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: _HEADER,
        body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Echec de la connexion');
    }
    const { token } = await response.json();
    if (!token) throw new Error('Token manquant dans la reponse');
    localStorage.setItem(TOKEN_KEY, token);
};

export const inscription = async (data: { nom: string; prenom: string; email: string; password: string; role?: string }): Promise<void> => {
    const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: _HEADER,
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || "Echec de l'inscription");
    }
    const { token } = await response.json();
    if (token) localStorage.setItem(TOKEN_KEY, token);
};

export const deconnexion = (): void => {
    localStorage.removeItem(TOKEN_KEY);
};

// Admin: CRUD users
export const getAdherents = async (): Promise<User[]> => {
    const response = await fetch(`${API_BASE}/users`, { headers: authHeader() });
    if (!response.ok) throw new Error('Echec du chargement des utilisateurs');
    return response.json();
};

export const getAdherentById = async (id: number): Promise<User> => {
    const response = await fetch(`${API_BASE}/users/${id}`, { headers: authHeader() });
    if (!response.ok) throw new Error('Utilisateur non trouve');
    return response.json();
};

export const createAdherent = async (user: any): Promise<User> => {
    const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: _HEADER,
        body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error("Echec de la creation");
    const data = await response.json();
    return data.user || data;
};

export const updateAdherent = async (id: number, user: any): Promise<User> => {
    const response = await fetch(`${API_BASE}/users/${id}`, {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify(user),
    });
    if (!response.ok) throw new Error("Echec de la mise a jour");
    return response.json();
};

export const deleteAdherent = async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE}/users/${id}`, {
        method: 'DELETE',
        headers: authHeader(),
    });
    if (!response.ok) throw new Error("Echec de la suppression");
};

export const getUsersByRole = async (role: string): Promise<User[]> => {
    const response = await fetch(`${API_BASE}/users/role/${role}`, { headers: authHeader() });
    if (!response.ok) throw new Error('Echec');
    return response.json();
};