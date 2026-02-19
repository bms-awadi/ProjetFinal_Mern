import { Request, Response } from "express";
import Produit from "../models/produit.model";

export const getAllProduits = async (req: Request, res: Response) => {
    try {
        const produits = await Produit.find();
        res.json(produits);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des produits" });
    }
};

export const getProduitById = async (req: Request, res: Response) => {
    try {
        const produit = await Produit.findById(req.params.id);
        if (!produit) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }
        res.json(produit);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du produit" });
    }
};

export const createProduit = async (req: Request, res: Response) => {
    try {
        const newProduit = new Produit(req.body);
        const savedProduit = await newProduit.save();
        res.status(201).json(savedProduit);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création du produit", error: error });
    }
};

export const updateProduit = async (req: Request, res: Response) => {
    try {
        const updatedProduit = await Produit.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedProduit) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }
        res.json(updatedProduit);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du produit" });
    }
};

export const deleteProduit = async (req: Request, res: Response) => {
    try {
        const deletedProduit = await Produit.findByIdAndDelete(req.params.id);
        if (!deletedProduit) {
            return res.status(404).json({ message: "Produit non trouvé" });
        }
        res.json({ message: "Produit supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du produit" });
    }
};

