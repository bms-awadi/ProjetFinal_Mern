import { pool } from '../config/db';
import { PoolClient } from 'pg';

export interface Order {
    id?: number;
    client_id: number;
    statut?: string;
    total: number;
    commission?: number;
    created_at?: Date;
    updated_at?: Date;
    client_nom?: string;
    client_prenom?: string;
    client_email?: string;
}

export interface SubOrder {
    id?: number;
    order_id: number;
    vendeur_id: number;
    statut?: string;
    sous_total: number;
    created_at?: Date;
    updated_at?: Date;
    vendeur_nom?: string;
    vendeur_prenom?: string;
}

export interface OrderItem {
    id?: number;
    sub_order_id: number;
    product_id: number;
    quantite: number;
    prix_unitaire: number;
    sous_total: number;
    product_nom?: string;
}

export class OrderRepository {
    async beginTransaction(): Promise<PoolClient> {
        const client = await pool.connect();
        await client.query('BEGIN');
        return client;
    }

    async commitTransaction(client: PoolClient): Promise<void> {
        await client.query('COMMIT');
        client.release();
    }

    async rollbackTransaction(client: PoolClient): Promise<void> {
        await client.query('ROLLBACK');
        client.release();
    }

    async findAll(): Promise<Order[]> {
        const result = await pool.query(
            `SELECT o.*, u.nom as client_nom, u.prenom as client_prenom, u.email as client_email
             FROM orders o
             JOIN users u ON o.client_id = u.id
             ORDER BY o.created_at DESC`
        );
        return result.rows;
    }

    async findById(id: number): Promise<Order | null> {
        const result = await pool.query(
            `SELECT o.*, u.nom as client_nom, u.prenom as client_prenom, u.email as client_email
             FROM orders o
             JOIN users u ON o.client_id = u.id
             WHERE o.id = $1`,
            [id]
        );
        return result.rows[0] || null;
    }

    async findByClient(clientId: number): Promise<Order[]> {
        const result = await pool.query(
            `SELECT o.*, u.nom as client_nom, u.prenom as client_prenom
             FROM orders o
             JOIN users u ON o.client_id = u.id
             WHERE o.client_id = $1
             ORDER BY o.created_at DESC`,
            [clientId]
        );
        return result.rows;
    }

    async createOrder(order: Order, client?: PoolClient): Promise<Order> {
        const queryClient = client || pool;
        const result = await queryClient.query(
            `INSERT INTO orders (client_id, total, commission, statut)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [order.client_id, order.total, order.commission || 0, order.statut || 'en_attente']
        );
        return result.rows[0];
    }

    async createSubOrder(subOrder: SubOrder, client?: PoolClient): Promise<SubOrder> {
        const queryClient = client || pool;
        const result = await queryClient.query(
            `INSERT INTO sub_orders (order_id, vendeur_id, sous_total, statut)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [subOrder.order_id, subOrder.vendeur_id, subOrder.sous_total, subOrder.statut || 'en_attente']
        );
        return result.rows[0];
    }

    async createOrderItem(item: OrderItem, client?: PoolClient): Promise<OrderItem> {
        const queryClient = client || pool;
        const result = await queryClient.query(
            `INSERT INTO order_items (sub_order_id, product_id, quantite, prix_unitaire, sous_total)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [item.sub_order_id, item.product_id, item.quantite, item.prix_unitaire, item.sous_total]
        );
        return result.rows[0];
    }

    async updateOrderStatus(id: number, statut: string): Promise<Order | null> {
        const result = await pool.query(
            `UPDATE orders SET statut = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
            [statut, id]
        );
        return result.rows[0] || null;
    }

    async updateSubOrderStatus(id: number, statut: string): Promise<SubOrder | null> {
        const result = await pool.query(
            `UPDATE sub_orders SET statut = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
            [statut, id]
        );
        return result.rows[0] || null;
    }

    async findSubOrdersByOrder(orderId: number): Promise<SubOrder[]> {
        const result = await pool.query(
            `SELECT so.*, u.nom as vendeur_nom, u.prenom as vendeur_prenom
             FROM sub_orders so
             JOIN users u ON so.vendeur_id = u.id
             WHERE so.order_id = $1
             ORDER BY so.id`,
            [orderId]
        );
        return result.rows;
    }

    async findSubOrdersByVendeur(vendeurId: number): Promise<SubOrder[]> {
        const result = await pool.query(
            `SELECT so.*, o.client_id, u.nom as client_nom, u.prenom as client_prenom
             FROM sub_orders so
             JOIN orders o ON so.order_id = o.id
             JOIN users u ON o.client_id = u.id
             WHERE so.vendeur_id = $1
             ORDER BY so.created_at DESC`,
            [vendeurId]
        );
        return result.rows;
    }

    async findItemsBySubOrder(subOrderId: number): Promise<OrderItem[]> {
        const result = await pool.query(
            `SELECT oi.*, p.nom as product_nom
             FROM order_items oi
             JOIN products p ON oi.product_id = p.id
             WHERE oi.sub_order_id = $1`,
            [subOrderId]
        );
        return result.rows;
    }

    async findOrderDetails(orderId: number): Promise<any> {
        const order = await this.findById(orderId);
        if (!order) return null;

        const subOrders = await this.findSubOrdersByOrder(orderId);
        const subOrdersWithItems = await Promise.all(
            subOrders.map(async (so) => {
                const items = await this.findItemsBySubOrder(so.id!);
                return { ...so, items };
            })
        );

        return { ...order, sub_orders: subOrdersWithItems };
    }

    async deleteOrder(id: number): Promise<boolean> {
        const result = await pool.query('DELETE FROM orders WHERE id = $1', [id]);
        return (result.rowCount ?? 0) > 0;
    }

    async countOrders(): Promise<number> {
        const result = await pool.query('SELECT COUNT(*) FROM orders');
        return parseInt(result.rows[0].count, 10);
    }

    async totalRevenue(): Promise<number> {
        const result = await pool.query('SELECT COALESCE(SUM(total), 0) as total FROM orders WHERE statut != $1', ['annulee']);
        return parseFloat(result.rows[0].total);
    }

    async totalCommission(): Promise<number> {
        const result = await pool.query('SELECT COALESCE(SUM(commission), 0) as total FROM orders WHERE statut != $1', ['annulee']);
        return parseFloat(result.rows[0].total);
    }
}
