import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
    try {
        const { nom, prenom, email, password, role, telephone, adresse } = req.body;
        if (!nom || !prenom || !email || !password) {
            res.status(400).json({ message: 'Nom, prenom, email et password sont requis' });
            return;
        }
        const result = await authService.register({ nom, prenom, email, password, role, telephone, adresse });
        res.status(201).json(result);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Email et password sont requis' });
            return;
        }
        const result = await authService.login(email, password);
        res.json(result);
    } catch (error: any) {
        res.status(401).json({ message: error.message });
    }
};
