import { pool } from '../config/db';

export interface Product {
    id?: number;
    nom: string;
    description?: string;
    prix: number;
    stock: number;
    categorie_id?: number;
    vendeur_id: number;
    categorie_nom?: string;
    vendeur_nom?: string;
    vendeur_prenom?: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface Category {
    id?: number;
    nom: string;
}

export class ProductRepository {
    async findAll(): Promise<Product[]> {
        const result = await pool.query(
            `SELECT p.*, c.nom as categorie_nom, u.nom as vendeur_nom, u.prenom as vendeur_prenom
             FROM products p
             LEFT JOIN categories c ON p.categorie_id = c.id
             LEFT JOIN users u ON p.vendeur_id = u.id
             ORDER BY p.id`
        );
        return result.rows;
    }

    async findById(id: number): Promise<Product | null> {
        const result = await pool.query(
            `SELECT p.*, c.nom as categorie_nom, u.nom as vendeur_nom, u.prenom as vendeur_prenom
             FROM products p
             LEFT JOIN categories c ON p.categorie_id = c.id
             LEFT JOIN users u ON p.vendeur_id = u.id
             WHERE p.id = $1`,
            [id]
        );
        return result.rows[0] || null;
    }

    async findByVendeur(vendeurId: number): Promise<Product[]> {
        const result = await pool.query(
            `SELECT p.*, c.nom as categorie_nom
             FROM products p
             LEFT JOIN categories c ON p.categorie_id = c.id
             WHERE p.vendeur_id = $1
             ORDER BY p.id`,
            [vendeurId]
        );
        return result.rows;
    }

    async findByCategorie(categorieId: number): Promise<Product[]> {
        const result = await pool.query(
            `SELECT p.*, c.nom as categorie_nom, u.nom as vendeur_nom, u.prenom as vendeur_prenom
             FROM products p
             LEFT JOIN categories c ON p.categorie_id = c.id
             LEFT JOIN users u ON p.vendeur_id = u.id
             WHERE p.categorie_id = $1
             ORDER BY p.id`,
            [categorieId]
        );
        return result.rows;
    }

    async create(product: Product): Promise<Product> {
        const result = await pool.query(
            `INSERT INTO products (nom, description, prix, stock, categorie_id, vendeur_id)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [product.nom, product.description || null, product.prix, product.stock, product.categorie_id || null, product.vendeur_id]
        );
        return result.rows[0];
    }

    async update(id: number, data: Partial<Product>): Promise<Product | null> {
        const fields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        const allowedFields = ['nom', 'description', 'prix', 'stock', 'categorie_id'];
        for (const [key, value] of Object.entries(data)) {
            if (allowedFields.includes(key) && value !== undefined) {
                fields.push(`${key} = $${paramIndex}`);
                values.push(value);
                paramIndex++;
            }
        }

        if (fields.length === 0) return this.findById(id);

        fields.push(`updated_at = NOW()`);
        values.push(id);

        const result = await pool.query(
            `UPDATE products SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
            values
        );
        return result.rows[0] || null;
    }

    async updateStock(id: number, quantite: number, client?: any): Promise<boolean> {
        const queryClient = client || pool;
        const result = await queryClient.query(
            `UPDATE products SET stock = stock - $1, updated_at = NOW()
             WHERE id = $2 AND stock >= $1
             RETURNING id`,
            [quantite, id]
        );
        return (result.rowCount ?? 0) > 0;
    }

    async delete(id: number): Promise<boolean> {
        const result = await pool.query('DELETE FROM products WHERE id = $1', [id]);
        return (result.rowCount ?? 0) > 0;
    }

    async hasActiveOrders(productId: number): Promise<boolean> {
        const result = await pool.query(
            `SELECT 1 FROM order_items oi
             JOIN sub_orders so ON oi.sub_order_id = so.id
             WHERE oi.product_id = $1 AND so.statut NOT IN ('livree')
             LIMIT 1`,
            [productId]
        );
        return result.rows.length > 0;
    }

    // Categories
    async findAllCategories(): Promise<Category[]> {
        const result = await pool.query('SELECT * FROM categories ORDER BY nom');
        return result.rows;
    }

    async createCategory(nom: string): Promise<Category> {
        const result = await pool.query(
            'INSERT INTO categories (nom) VALUES ($1) RETURNING *',
            [nom]
        );
        return result.rows[0];
    }
}
