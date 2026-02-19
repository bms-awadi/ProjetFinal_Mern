import express from 'express';
import { createProduit, deleteProduit, getAllProduits, getProduitById, updateProduit } from '../controllers/produit.controller';

const router = express.Router();

// Route pour créer un produit
router.post('/', createProduit);
// Route pour obtenir tous les produits
router.get('/', getAllProduits);
// Route pour obtenir un produit par ID
router.get('/:id', getProduitById);
// Route pour mettre à jour un produit
router.put('/:id', updateProduit);
// Route pour supprimer un produit
router.delete('/:id', deleteProduit);

export default router;