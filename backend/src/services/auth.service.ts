import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository';
import { JWT_SECRET } from '../middleware/auth.middleware';

const userRepository = new UserRepository();

export class AuthService {
    async register(data: { nom: string; prenom: string; email: string; password: string; role?: string; telephone?: string; adresse?: string }) {
        const existing = await userRepository.findByEmail(data.email);
        if (existing) {
            throw new Error('Un compte avec cet email existe deja');
        }

        const allowedRoles = ['client', 'vendeur', 'livreur'];
        const role = data.role && allowedRoles.includes(data.role) ? data.role : 'client';

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const user = await userRepository.create({
            ...data,
            password: hashedPassword,
            role,
        });

        const token = this.generateToken(user);
        return { user, token };
    }

    async login(email: string, password: string) {
        const user = await userRepository.findByEmail(email);
        if (!user) {
            throw new Error('Email ou mot de passe incorrect');
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
            throw new Error('Email ou mot de passe incorrect');
        }

        const token = this.generateToken(user);
        const { password: _, ...userWithoutPassword } = user;
        return { user: userWithoutPassword, token };
    }

    private generateToken(user: any): string {
        return jwt.sign(
            { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role },
            JWT_SECRET,
            { expiresIn: '24h' }
        );
    }
}
