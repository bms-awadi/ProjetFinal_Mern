export interface User {
    id?: number;
    nom: string;
    prenom: string;
    email: string;
    password?: string;
    role: string;
    telephone?: string;
    adresse?: string;
    created_at?: string;
}

// Backward compat alias
export type Adherent = User;
