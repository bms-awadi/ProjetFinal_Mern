import express from 'express';
import { createCommande, deleteCommande } from '../controllers/commande.controller';

const router = express.Router();

router.post('/', createCommande);
router.delete('/:id', deleteCommande);

export default router;