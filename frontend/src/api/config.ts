export const API_BASE = (import.meta.env.VITE_API_URL as string) || 'http://localhost:3001/api';

export const _HEADER: Record<string, string> = {
    'Content-Type': 'application/json',
};

export const authHeader = (): Record<string, string> => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
};