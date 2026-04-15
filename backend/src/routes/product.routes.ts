import express from 'express';
import { authenticateToken, authorizeRoles } from '../middleware/auth.middleware';
import {
    getAllProducts,
    getProductById,
    getProductsByVendeur,
    getProductsByCategorie,
    createProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    createCategory,
} from '../controllers/product.controller';

const router = express.Router();

// Public routes
router.get('/', getAllProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);
router.get('/categorie/:categorieId', getProductsByCategorie);

// Vendeur routes
router.get('/vendeur/me', authenticateToken, authorizeRoles('vendeur'), getProductsByVendeur);
router.post('/', authenticateToken, authorizeRoles('vendeur', 'admin'), createProduct);
router.put('/:id', authenticateToken, authorizeRoles('vendeur', 'admin'), updateProduct);
router.delete('/:id', authenticateToken, authorizeRoles('vendeur', 'admin'), deleteProduct);

// Admin routes
router.post('/categories', authenticateToken, authorizeRoles('admin'), createCategory);

export default router;
