import { Request, Response } from 'express';
import Adherent from '../models/adherent.model';
import bcrypt from 'bcrypt';

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
        const { mdp, ...rest } = req.body;
        const hashedPassword = await bcrypt.hash(mdp, 10);

        const newAdherent = new Adherent({
            ...rest,
            mdp: hashedPassword,
        });
        const savedAdherent = await newAdherent.save();
        res.status(201).json(savedAdherent);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de l’adhérent', error });
    }
};

export const updateAdherent = async (req: Request, res: Response) => {
    try {
        const { mdp, ...rest } = req.body;

        const dataToUpdate = mdp
            ? { ...rest, mdp: await bcrypt.hash(mdp, 10) }
            : rest;

        const updatedAdherent = await Adherent.findByIdAndUpdate(req.params.id, dataToUpdate, { new: true });
        if (!updatedAdherent) {
            return res.status(404).json({ message: 'Adhérent non trouvé' });
        }
        res.json(updatedAdherent);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de l'adhérent", error });
    }
}

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

export const loginAdherent = async (req: Request, res: Response) => {
    try {
        const { email, mdp } = req.body;
        const adherent = await Adherent.findOne({ email });
        if (!adherent) {
            return res.status(404).json({ message: 'Adhérent non trouvé' });
        }
        const isPasswordValid = await bcrypt.compare(mdp, adherent.mdp);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Mot de passe incorrect' });
        }
        res.json({ message: 'Connexion réussie', adherent });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la connexion de l’adhérent', error });
    }
};