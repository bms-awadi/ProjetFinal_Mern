import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import {
    getAllDeliveries,
    getDeliveryById,
    getMyDeliveries,
    getAvailableDeliveries,
    assignDelivery,
    updateDeliveryStatus,
} from '../controllers/delivery.controller';

const router = express.Router();

// Livreur routes
router.get('/available', authenticateToken, authorizeRoles('livreur'), getAvailableDeliveries);
router.get('/me', authenticateToken, authorizeRoles('livreur'), getMyDeliveries);
router.post('/:id/assign', authenticateToken, authorizeRoles('livreur'), assignDelivery);
router.put('/:id/status', authenticateToken, authorizeRoles('livreur'), updateDeliveryStatus);

// Admin routes
router.get('/', authenticateToken, authorizeRoles('admin'), getAllDeliveries);
router.get('/:id', authenticateToken, authorizeRoles('admin', 'livreur'), getDeliveryById);

export default router;
