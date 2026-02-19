import { Request, Response } from 'express';
import Commande from '../models/commande.model';

export const getAllCommandes = async (req: Request, res: Response) => {
    try {
        const commandes = await Commande.find()
            .populate('adherent')
            .populate('produit');
        res.status(200).json(commandes);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des commandes', error });
    }
};

export const getCommandeById = async (req: Request, res: Response) => {
    try {
        const commande = await Commande.findById(req.params.id);
        if (!commande) {
            return res.status(404).json({ message: 'Adhérent non trouvé' });
        }
        res.status(200).json(commande);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de l’adhérent', error });
    }
};

export const createCommande = async (req: Request, res: Response) => {
    try {
        const newCommande = new Commande(req.body);
        const savedCommande = await newCommande.save();
        res.status(201).json(savedCommande);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de l’adhérent', error });
    }
};

export const deleteCommande = async (req: Request, res: Response) => {
    try {
        const deletedCommande = await Commande.findByIdAndDelete(req.params.id);
        if (!deletedCommande) {
            return res.status(404).json({ message: 'Adhérent non trouvé' });
        }
        res.status(200).json({ message: 'Adhérent supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de l’adhérent', error });
    }
};
