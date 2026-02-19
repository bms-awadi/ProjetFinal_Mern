import { Request, Response } from 'express';
import Adherent from '../models/adherent.model';


export const getAllAdherents = async (req: Request, res: Response) => {
    try {
        const adherents = await Adherent.find();
        res.status(200).json(adherents);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des adhérents', error });
    }
};

export const getAdherentById = async (req: Request, res: Response) => {
    try {
        const adherent = await Adherent.findById(req.params.id);
        if (!adherent) {
            return res.status(404).json({ message: 'Adhérent non trouvé' });
        }
        res.status(200).json(adherent);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération de l’adhérent', error });
    }
};

export const createAdherent = async (req: Request, res: Response) => {
    try {
        const newAdherent = new Adherent(req.body);
        const savedAdherent = await newAdherent.save();
        res.status(201).json(savedAdherent);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de l’adhérent', error });
    }
};

export const updateAdherent = async (req: Request, res: Response) => {
    try {
        const updatedAdherent = await Adherent.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedAdherent) {
            return res.status(404).json({ message: 'Adhérent non trouvé' });
        }
        res.json(updatedAdherent);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la mise à jour de l’adhérent', error });
    }
};

export const deleteAdherent = async (req: Request, res: Response) => {
    try {
        const deletedAdherent = await Adherent.findByIdAndDelete(req.params.id);
        if (!deletedAdherent) {
            return res.status(404).json({ message: 'Adhérent non trouvé' });
        }
        res.json({ message: 'Adhérent supprimé avec succès' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la suppression de l’adhérent', error });
    }
};
