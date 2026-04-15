import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { OrderService } from '../services/order.service';

const orderService = new OrderService();

export const getAllOrders = async (req: AuthRequest, res: Response) => {
    try {
        const orders = await orderService.getAll();
        res.json(orders);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getOrderById = async (req: AuthRequest, res: Response) => {
    try {
        const order = await orderService.getById(parseInt(req.params.id));
        if (!order) {
            res.status(404).json({ message: 'Commande non trouvee' });
            return;
        }
        res.json(order);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getMyOrders = async (req: AuthRequest, res: Response) => {
    try {
        const orders = await orderService.getByClient(req.user!.id);
        res.json(orders);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getVendeurOrders = async (req: AuthRequest, res: Response) => {
    try {
        const subOrders = await orderService.getByVendeur(req.user!.id);
        res.json(subOrders);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createOrder = async (req: AuthRequest, res: Response) => {
    try {
        const { items, adresse_livraison } = req.body;
        if (!items || !adresse_livraison) {
            res.status(400).json({ message: 'Items et adresse de livraison sont requis' });
            return;
        }
        const order = await orderService.createOrder(req.user!.id, items, adresse_livraison);
        res.status(201).json(order);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateOrderStatus = async (req: AuthRequest, res: Response) => {
    try {
        const { statut } = req.body;
        const order = await orderService.updateStatus(parseInt(req.params.id), statut);
        res.json(order);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const payOrder = async (req: AuthRequest, res: Response) => {
    try {
        const { methode } = req.body;
        const payment = await orderService.simulatePayment(parseInt(req.params.id), methode);
        res.json({ message: 'Paiement accepte', payment });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteOrder = async (req: AuthRequest, res: Response) => {
    try {
        await orderService.deleteOrder(parseInt(req.params.id));
        res.json({ message: 'Commande supprimee' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getOrderStats = async (req: AuthRequest, res: Response) => {
    try {
        const stats = await orderService.getStats();
        res.json(stats);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
