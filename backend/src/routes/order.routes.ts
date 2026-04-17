import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import {
    getAllOrders,
    getOrderById,
    getMyOrders,
    getVendeurOrders,
    createOrder,
    updateOrderStatus,
    payOrder,
    deleteOrder,
    getOrderStats,
} from '../controllers/order.controller';

const router = express.Router();

// Client routes
router.get('/me', authenticateToken, getMyOrders);
router.post('/', authenticateToken, authorizeRoles('client', 'admin'), createOrder);
router.post('/:id/pay', authenticateToken, payOrder);

// Vendeur routes
router.get('/vendeur/me', authenticateToken, authorizeRoles('vendeur'), getVendeurOrders);

// Admin routes
router.get('/', authenticateToken, authorizeRoles('admin'), getAllOrders);
router.get('/stats', authenticateToken, authorizeRoles('admin'), getOrderStats);
router.get('/:id', authenticateToken, getOrderById);
router.put('/:id/status', authenticateToken, authorizeRoles('admin'), updateOrderStatus);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteOrder);

export default router;
