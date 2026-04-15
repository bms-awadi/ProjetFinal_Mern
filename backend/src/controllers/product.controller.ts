import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { ProductService } from '../services/product.service';

const productService = new ProductService();

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        const products = await productService.getAll();
        res.json(products);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const product = await productService.getById(parseInt(req.params.id as string));
        res.json(product);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

export const getProductsByVendeur = async (req: AuthRequest, res: Response) => {
    try {
        const vendeurId = req.params.vendeurId ? parseInt(req.params.vendeurId as string) : req.user!.id;
        const products = await productService.getByVendeur(vendeurId);
        res.json(products);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getProductsByCategorie = async (req: Request, res: Response) => {
    try {
        const products = await productService.getByCategorie(parseInt(req.params.categorieId as string));
        res.json(products);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createProduct = async (req: AuthRequest, res: Response) => {
    try {
        const product = await productService.create(req.body, req.user!.id);
        res.status(201).json(product);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateProduct = async (req: AuthRequest, res: Response) => {
    try {
        const product = await productService.update(parseInt(req.params.id as string), req.body, req.user!.id);
        res.json(product);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteProduct = async (req: AuthRequest, res: Response) => {
    try {
        const isAdmin = req.user!.role === 'admin';
        await productService.delete(parseInt(req.params.id as string), req.user!.id, isAdmin);
        res.json({ message: 'Produit supprime avec succes' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await productService.getCategories();
        res.json(categories);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const createCategory = async (req: AuthRequest, res: Response) => {
    try {
        const category = await productService.createCategory(req.body.nom);
        res.status(201).json(category);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};
