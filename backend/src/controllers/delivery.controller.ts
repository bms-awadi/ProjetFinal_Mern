import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { DeliveryService } from '../services/delivery.service';

const deliveryService = new DeliveryService();

export const getAllDeliveries = async (req: AuthRequest, res: Response) => {
    try {
        const deliveries = await deliveryService.getAll();
        res.json(deliveries);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getDeliveryById = async (req: AuthRequest, res: Response) => {
    try {
        const delivery = await deliveryService.getById(parseInt(req.params.id as string));
        res.json(delivery);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

export const getMyDeliveries = async (req: AuthRequest, res: Response) => {
    try {
        const deliveries = await deliveryService.getByLivreur(req.user!.id);
        res.json(deliveries);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getAvailableDeliveries = async (req: AuthRequest, res: Response) => {
    try {
        const deliveries = await deliveryService.getAvailable();
        res.json(deliveries);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const assignDelivery = async (req: AuthRequest, res: Response) => {
    try {
        const delivery = await deliveryService.assignLivreur(parseInt(req.params.id as string), req.user!.id);
        res.json(delivery);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateDeliveryStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { statut } = req.body;
        const delivery = await deliveryService.updateStatus(parseInt(req.params.id as string), statut, req.user!.id);
        res.json(delivery);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
