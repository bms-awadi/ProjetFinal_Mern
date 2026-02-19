import express from 'express';
import { getAllCommandes, getCommandeById, createCommande, deleteCommande } from '../controllers/commande.controller';

const router = express.Router();

router.get('/', getAllCommandes);
router.get('/:id', getCommandeById);
router.post('/', createCommande);
router.delete('/:id', deleteCommande);

export default router;