import { pool } from '../config/db';

export interface User {
    id?: number;
    nom: string;
    prenom: string;
    email: string;
    password: string;
    role: string;
    telephone?: string;
    adresse?: string;
    created_at?: Date;
    updated_at?: Date;
}

export class UserRepository {
    async findAll(): Promise<User[]> {
        const result = await pool.query(
            'SELECT id, nom, prenom, email, role, telephone, adresse, created_at, updated_at FROM users ORDER BY id'
        );
        return result.rows;
    }

    async findById(id: number): Promise<User | null> {
        const result = await pool.query(
            'SELECT * FROM users WHERE id = $1',
            [id]
        );
        return result.rows[0] || null;
    }

    async findByEmail(email: string): Promise<User | null> {
        const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [email]
        );
        return result.rows[0] || null;
    }

    async findByRole(role: string): Promise<User[]> {
        const result = await pool.query(
            'SELECT id, nom, prenom, email, role, telephone, adresse, created_at FROM users WHERE role = $1 ORDER BY id',
            [role]
        );
        return result.rows;
    }

    async create(user: User): Promise<User> {
        const result = await pool.query(
            `INSERT INTO users (nom, prenom, email, password, role, telephone, adresse)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             RETURNING id, nom, prenom, email, role, telephone, adresse, created_at`,
            [user.nom, user.prenom, user.email, user.password, user.role, user.telephone || null, user.adresse || null]
        );
        return result.rows[0];
    }

    async update(id: number, data: Partial<User>): Promise<User | null> {
        const fields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        for (const [key, value] of Object.entries(data)) {
            if (key !== 'id' && key !== 'created_at' && value !== undefined) {
                fields.push(`${key} = $${paramIndex}`);
                values.push(value);
                paramIndex++;
            }
        }

        if (fields.length === 0) return this.findById(id);

        fields.push(`updated_at = NOW()`);
        values.push(id);

        const result = await pool.query(
            `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex}
             RETURNING id, nom, prenom, email, role, telephone, adresse, updated_at`,
            values
        );
        return result.rows[0] || null;
    }

    async delete(id: number): Promise<boolean> {
        const result = await pool.query('DELETE FROM users WHERE id = $1', [id]);
        return (result.rowCount ?? 0) > 0;
    }

    async count(): Promise<number> {
        const result = await pool.query('SELECT COUNT(*) FROM users');
        return parseInt(result.rows[0].count, 10);
    }

    async countByRole(role: string): Promise<number> {
        const result = await pool.query('SELECT COUNT(*) FROM users WHERE role = $1', [role]);
        return parseInt(result.rows[0].count, 10);
    }
}
