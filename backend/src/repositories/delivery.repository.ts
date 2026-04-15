import { pool } from '../config/db';

export interface Delivery {
    id?: number;
    sub_order_id: number;
    livreur_id?: number;
    statut?: string;
    adresse_livraison: string;
    created_at?: Date;
    updated_at?: Date;
    livreur_nom?: string;
    livreur_prenom?: string;
    vendeur_nom?: string;
    order_id?: number;
    client_nom?: string;
    client_prenom?: string;
}

export class DeliveryRepository {
    async findAll(): Promise<Delivery[]> {
        const result = await pool.query(
            `SELECT d.*, 
                    ul.nom as livreur_nom, ul.prenom as livreur_prenom,
                    uv.nom as vendeur_nom,
                    so.order_id, o.client_id,
                    uc.nom as client_nom, uc.prenom as client_prenom
             FROM deliveries d
             LEFT JOIN users ul ON d.livreur_id = ul.id
             JOIN sub_orders so ON d.sub_order_id = so.id
             JOIN users uv ON so.vendeur_id = uv.id
             JOIN orders o ON so.order_id = o.id
             JOIN users uc ON o.client_id = uc.id
             ORDER BY d.created_at DESC`
        );
        return result.rows;
    }

    async findById(id: number): Promise<Delivery | null> {
        const result = await pool.query(
            `SELECT d.*, 
                    ul.nom as livreur_nom, ul.prenom as livreur_prenom,
                    so.order_id,
                    uc.nom as client_nom, uc.prenom as client_prenom
             FROM deliveries d
             LEFT JOIN users ul ON d.livreur_id = ul.id
             JOIN sub_orders so ON d.sub_order_id = so.id
             JOIN orders o ON so.order_id = o.id
             JOIN users uc ON o.client_id = uc.id
             WHERE d.id = $1`,
            [id]
        );
        return result.rows[0] || null;
    }

    async findByLivreur(livreurId: number): Promise<Delivery[]> {
        const result = await pool.query(
            `SELECT d.*, so.order_id,
                    uc.nom as client_nom, uc.prenom as client_prenom
             FROM deliveries d
             JOIN sub_orders so ON d.sub_order_id = so.id
             JOIN orders o ON so.order_id = o.id
             JOIN users uc ON o.client_id = uc.id
             WHERE d.livreur_id = $1
             ORDER BY d.created_at DESC`,
            [livreurId]
        );
        return result.rows;
    }

    async findAvailable(): Promise<Delivery[]> {
        const result = await pool.query(
            `SELECT d.*, so.order_id,
                    uc.nom as client_nom, uc.prenom as client_prenom
             FROM deliveries d
             JOIN sub_orders so ON d.sub_order_id = so.id
             JOIN orders o ON so.order_id = o.id
             JOIN users uc ON o.client_id = uc.id
             WHERE d.statut = 'en_attente' AND d.livreur_id IS NULL
             ORDER BY d.created_at ASC`
        );
        return result.rows;
    }

    async create(delivery: Delivery): Promise<Delivery> {
        const result = await pool.query(
            `INSERT INTO deliveries (sub_order_id, livreur_id, adresse_livraison, statut)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [delivery.sub_order_id, delivery.livreur_id || null, delivery.adresse_livraison, delivery.statut || 'en_attente']
        );
        return result.rows[0];
    }

    async assignLivreur(deliveryId: number, livreurId: number): Promise<Delivery | null> {
        const result = await pool.query(
            `UPDATE deliveries SET livreur_id = $1, statut = 'prise_en_charge', updated_at = NOW()
             WHERE id = $2 AND statut = 'en_attente'
             RETURNING *`,
            [livreurId, deliveryId]
        );
        return result.rows[0] || null;
    }

    async updateStatus(id: number, statut: string): Promise<Delivery | null> {
        const result = await pool.query(
            `UPDATE deliveries SET statut = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
            [statut, id]
        );
        return result.rows[0] || null;
    }

    async countActiveLivraisons(livreurId: number): Promise<number> {
        const result = await pool.query(
            `SELECT COUNT(*) FROM deliveries
             WHERE livreur_id = $1 AND statut IN ('prise_en_charge', 'en_cours')`,
            [livreurId]
        );
        return parseInt(result.rows[0].count, 10);
    }
}
