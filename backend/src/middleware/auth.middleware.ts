import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'votre_cle_secrete_livraison';

export interface AuthPayload {
    id: number;
    nom: string;
    prenom: string;
    email: string;
    role: string;
}

export interface AuthRequest extends Request {
    user?: AuthPayload;
}

export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ message: 'Token manquant' });
        return;
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as AuthPayload;
        req.user = decoded;
        next();
    } catch {
        res.status(403).json({ message: 'Token invalide ou expire' });
    }
};

export const authorizeRoles = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ message: 'Acces refuse: role insuffisant' });
            return;
        }
        next();
    };
};

export { JWT_SECRET };
