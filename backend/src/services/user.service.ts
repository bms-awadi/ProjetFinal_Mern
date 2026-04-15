import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository';

const userRepository = new UserRepository();

export class UserService {
    async getAll() {
        return userRepository.findAll();
    }

    async getById(id: number) {
        const user = await userRepository.findById(id);
        if (!user) throw new Error('Utilisateur non trouve');
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }

    async getByRole(role: string) {
        return userRepository.findByRole(role);
    }

    async update(id: number, data: any) {
        if (data.password) {
            data.password = await bcrypt.hash(data.password, 10);
        }
        const user = await userRepository.update(id, data);
        if (!user) throw new Error('Utilisateur non trouve');
        return user;
    }

    async delete(id: number) {
        const deleted = await userRepository.delete(id);
        if (!deleted) throw new Error('Utilisateur non trouve');
        return true;
    }

    async getStats() {
        const total = await userRepository.count();
        const clients = await userRepository.countByRole('client');
        const vendeurs = await userRepository.countByRole('vendeur');
        const livreurs = await userRepository.countByRole('livreur');
        return { total, clients, vendeurs, livreurs };
    }
}
