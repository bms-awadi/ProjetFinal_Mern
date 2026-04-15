import { API_BASE, authHeader } from './config';
import { Delivery } from '../model/delivery';

export const getAvailableDeliveries = async (): Promise<Delivery[]> => {
    const response = await fetch(`${API_BASE}/deliveries/available`, { headers: authHeader() });
    if (!response.ok) throw new Error('Echec');
    return response.json();
};

export const getMyDeliveries = async (): Promise<Delivery[]> => {
    const response = await fetch(`${API_BASE}/deliveries/me`, { headers: authHeader() });
    if (!response.ok) throw new Error('Echec');
    return response.json();
};

export const getAllDeliveries = async (): Promise<Delivery[]> => {
    const response = await fetch(`${API_BASE}/deliveries`, { headers: authHeader() });
    if (!response.ok) throw new Error('Echec');
    return response.json();
};

export const assignDelivery = async (deliveryId: number): Promise<Delivery> => {
    const response = await fetch(`${API_BASE}/deliveries/${deliveryId}/assign`, {
        method: 'POST',
        headers: authHeader(),
    });
    if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.message || 'Echec');
    }
    return response.json();
};

export const updateDeliveryStatus = async (deliveryId: number, statut: string): Promise<Delivery> => {
    const response = await fetch(`${API_BASE}/deliveries/${deliveryId}/status`, {
        method: 'PUT',
        headers: authHeader(),
        body: JSON.stringify({ statut }),
    });
    if (!response.ok) throw new Error('Echec');
    return response.json();
};
