import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import {
    getAllUsers,
    getUserById,
    getUsersByRole,
    getProfile,
    updateUser,
    updateProfile,
    deleteUser,
    getStats,
} from '../controllers/user.controller';

const router = express.Router();

// Profile (any authenticated user)
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);

// Stats (admin only)
router.get('/stats', authenticateToken, authorizeRoles('admin'), getStats);

// Admin-only user management
router.get('/', authenticateToken, authorizeRoles('admin'), getAllUsers);
router.get('/role/:role', authenticateToken, authorizeRoles('admin'), getUsersByRole);
router.get('/:id', authenticateToken, authorizeRoles('admin'), getUserById);
router.put('/:id', authenticateToken, authorizeRoles('admin'), updateUser);
router.delete('/:id', authenticateToken, authorizeRoles('admin'), deleteUser);

export default router;
