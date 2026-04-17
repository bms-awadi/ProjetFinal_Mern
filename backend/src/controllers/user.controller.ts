import { Response } from 'express';
import { AuthRequest } from '../middleware/auth.middleware';
import { UserService } from '../services/user.service';

const userService = new UserService();

export const getAllUsers = async (req: AuthRequest, res: Response) => {
    try {
        const users = await userService.getAll();
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserById = async (req: AuthRequest, res: Response) => {
    try {
        const user = await userService.getById(parseInt(req.params.id as string));
        res.json(user);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

export const getUsersByRole = async (req: AuthRequest, res: Response) => {
    try {
        const users = await userService.getByRole(req.params.role as string);
        res.json(users);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getProfile = async (req: AuthRequest, res: Response) => {
    try {
        const user = await userService.getById(req.user!.id);
        res.json(user);
    } catch (error: any) {
        res.status(404).json({ message: error.message });
    }
};

export const updateUser = async (req: AuthRequest, res: Response) => {
    try {
        const user = await userService.update(parseInt(req.params.id as string), req.body);
        res.json(user);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const updateProfile = async (req: AuthRequest, res: Response) => {
    try {
        const { role, ...data } = req.body; // prevent role self-change
        const user = await userService.update(req.user!.id, data);
        res.json(user);
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const deleteUser = async (req: AuthRequest, res: Response) => {
    try {
        await userService.delete(parseInt(req.params.id as string));
        res.json({ message: 'Utilisateur supprime avec succes' });
    } catch (error: any) {
        res.status(400).json({ message: error.message });
    }
};

export const getStats = async (req: AuthRequest, res: Response) => {
    try {
        const stats = await userService.getStats();
        res.json(stats);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
