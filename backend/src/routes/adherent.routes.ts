import express from 'express';
import { createAdherent, getAllAdherents, getAdherentById, updateAdherent, deleteAdherent, loginAdherent } from '../controllers/adherent.controller';

const router = express.Router();

// Route pour créer un produit
router.post('/', createAdherent);
// Route pour obtenir tous les produits
router.get('/', getAllAdherents);
// Route pour obtenir un produit par ID
router.get('/:id', getAdherentById);
// Route pour mettre à jour un produit
router.put('/:id', updateAdherent);
// Route pour supprimer un produit
router.delete('/:id', deleteAdherent);
// Route pour le login d'un adhérent
router.post('/login', loginAdherent);

export default router;