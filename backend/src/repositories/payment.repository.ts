import { pool } from '../config/db';

export interface Payment {
    id?: number;
    order_id: number;
    montant: number;
    statut?: string;
    methode?: string;
    created_at?: Date;
}

export class PaymentRepository {
    async findByOrder(orderId: number): Promise<Payment | null> {
        const result = await pool.query(
            'SELECT * FROM payments WHERE order_id = $1',
            [orderId]
        );
        return result.rows[0] || null;
    }

    async create(payment: Payment): Promise<Payment> {
        const result = await pool.query(
            `INSERT INTO payments (order_id, montant, statut, methode)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [payment.order_id, payment.montant, payment.statut || 'en_attente', payment.methode || 'carte']
        );
        return result.rows[0];
    }

    async updateStatus(id: number, statut: string): Promise<Payment | null> {
        const result = await pool.query(
            `UPDATE payments SET statut = $1 WHERE id = $2 RETURNING *`,
            [statut, id]
        );
        return result.rows[0] || null;
    }
}
