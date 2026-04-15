import { pool } from './db';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

const initDB = async () => {
    const client = await pool.connect();
    try {
        const sql = fs.readFileSync(path.join(__dirname, '../sql/init.sql'), 'utf-8');
        await client.query(sql);
        console.log('Database schema created successfully.');

        // Seed admin user
        const adminPassword = await bcrypt.hash('admin123', 10);
        await client.query(
            `INSERT INTO users (nom, prenom, email, password, role)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (email) DO NOTHING`,
            ['Admin', 'Super', 'admin@livraison.com', adminPassword, 'admin']
        );
        console.log('Admin user seeded (admin@livraison.com / admin123).');

        // Seed a demo vendeur
        const vendeurPassword = await bcrypt.hash('vendeur123', 10);
        await client.query(
            `INSERT INTO users (nom, prenom, email, password, role)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (email) DO NOTHING`,
            ['Dupont', 'Jean', 'vendeur@livraison.com', vendeurPassword, 'vendeur']
        );
        console.log('Demo vendeur seeded (vendeur@livraison.com / vendeur123).');

        // Seed a demo livreur
        const livreurPassword = await bcrypt.hash('livreur123', 10);
        await client.query(
            `INSERT INTO users (nom, prenom, email, password, role)
             VALUES ($1, $2, $3, $4, $5)
             ON CONFLICT (email) DO NOTHING`,
            ['Martin', 'Pierre', 'livreur@livraison.com', livreurPassword, 'livreur']
        );
        console.log('Demo livreur seeded (livreur@livraison.com / livreur123).');

        console.log('Database initialization complete.');
    } catch (error) {
        console.error('Error initializing database:', error);
    } finally {
        client.release();
        await pool.end();
    }
};

initDB();
