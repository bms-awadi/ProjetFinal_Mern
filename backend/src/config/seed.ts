import { pool } from './db';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

const seed = async () => {
    const client = await pool.connect();
    try {
        console.log('--- Demarrage du seeding ---');

        // 1) Hash passwords
        const hash = await bcrypt.hash('client123', 10);
        const hashV = await bcrypt.hash('vendeur123', 10);
        const hashL = await bcrypt.hash('livreur123', 10);

        // 2) Read and execute seed.sql with password placeholders replaced
        let sql = fs.readFileSync(path.join(__dirname, '../sql/seed.sql'), 'utf-8');
        sql = sql.replace(/\$HASH_CLIENT2/g, hash);
        sql = sql.replace(/\$HASH_CLIENT3/g, hash);
        sql = sql.replace(/\$HASH_VENDEUR2/g, hashV);
        sql = sql.replace(/\$HASH_VENDEUR3/g, hashV);
        sql = sql.replace(/\$HASH_LIVREUR2/g, hashL);
        await client.query(sql);
        console.log('Utilisateurs et produits inseres.');

        // 3) Retrieve user IDs
        const getUser = async (email: string) => {
            const r = await client.query('SELECT id FROM users WHERE email = $1', [email]);
            return r.rows[0]?.id;
        };

        const clientSarah = await getUser('sarah@client.com');
        const clientThomas = await getUser('thomas@client.com');
        const vendeurJean = await getUser('vendeur@livraison.com');
        const vendeurSophie = await getUser('sophie@vendeur.com');
        const vendeurLucas = await getUser('lucas@vendeur.com');
        const livreurPierre = await getUser('livreur@livraison.com');
        const livreurMarie = await getUser('marie@livreur.com');

        // 4) Get some product IDs
        const getProduct = async (nom: string) => {
            const r = await client.query('SELECT id, prix, vendeur_id FROM products WHERE nom = $1', [nom]);
            return r.rows[0];
        };

        const ballon = await getProduct('Ballon de Football Officiel');
        const maillotFr = await getProduct('Maillot Equipe de France');
        const raquette = await getProduct('Raquette de Tennis Wilson');
        const lunettes = await getProduct('Lunettes de Natation Pro');
        const tapis = await getProduct('Tapis de Yoga Premium');
        const halteres = await getProduct('Kit Halteres Reglables 20kg');
        const velo = await getProduct('Velo de Route Carbon');
        const casque = await getProduct('Casque Velo Aero');
        const chaussures = await getProduct('Chaussures Running Trail');
        const montre = await getProduct('Montre GPS Sport');
        const tshirt = await getProduct('T-shirt Running Respirant');

        // Helper to check if orders exist already
        const existingOrders = await client.query('SELECT COUNT(*) FROM orders');
        const count = parseInt(existingOrders.rows[0].count, 10);
        if (count > 1) {
            console.log('Des commandes existent deja, seeding des commandes ignore.');
            console.log('--- Seeding termine ---');
            return;
        }

        // ========== COMMANDE 1 : Sarah achete chez Jean + Sophie (livree) ==========
        const o1 = await client.query(
            `INSERT INTO orders (client_id, statut, total, commission) VALUES ($1, 'livree', $2, $3) RETURNING id`,
            [clientSarah, 144.97, 14.50]
        );
        const order1 = o1.rows[0].id;

        // Sub-order Jean (ballon + maillot)
        const so1a = await client.query(
            `INSERT INTO sub_orders (order_id, vendeur_id, statut, sous_total) VALUES ($1, $2, 'livree', $3) RETURNING id`,
            [order1, vendeurJean, 119.98]
        );
        const sub1a = so1a.rows[0].id;
        await client.query(
            `INSERT INTO order_items (sub_order_id, product_id, quantite, prix_unitaire, sous_total) VALUES ($1, $2, 1, $3, $3)`,
            [sub1a, ballon.id, ballon.prix]
        );
        await client.query(
            `INSERT INTO order_items (sub_order_id, product_id, quantite, prix_unitaire, sous_total) VALUES ($1, $2, 1, $3, $3)`,
            [sub1a, maillotFr.id, maillotFr.prix]
        );

        // Sub-order Sophie (lunettes)
        const so1b = await client.query(
            `INSERT INTO sub_orders (order_id, vendeur_id, statut, sous_total) VALUES ($1, $2, 'livree', $3) RETURNING id`,
            [order1, vendeurSophie, 24.99]
        );
        const sub1b = so1b.rows[0].id;
        await client.query(
            `INSERT INTO order_items (sub_order_id, product_id, quantite, prix_unitaire, sous_total) VALUES ($1, $2, 1, $3, $3)`,
            [sub1b, lunettes.id, lunettes.prix]
        );

        // Payment
        await client.query(
            `INSERT INTO payments (order_id, montant, statut, methode) VALUES ($1, $2, 'accepte', 'carte')`,
            [order1, 144.97]
        );

        // Deliveries (livrees)
        await client.query(
            `INSERT INTO deliveries (sub_order_id, livreur_id, statut, adresse_livraison) VALUES ($1, $2, 'livree', $3)`,
            [sub1a, livreurPierre, '12 Rue de la Paix, 63000 Clermont-Ferrand']
        );
        await client.query(
            `INSERT INTO deliveries (sub_order_id, livreur_id, statut, adresse_livraison) VALUES ($1, $2, 'livree', $3)`,
            [sub1b, livreurMarie, '12 Rue de la Paix, 63000 Clermont-Ferrand']
        );

        console.log('Commande #1 (livree) creee.');

        // ========== COMMANDE 2 : Thomas achete chez Lucas + Sophie (en cours) ==========
        const totalC2 = parseFloat(velo.prix) + parseFloat(casque.prix) + parseFloat(tapis.prix);
        const o2 = await client.query(
            `INSERT INTO orders (client_id, statut, total, commission) VALUES ($1, 'payee', $2, $3) RETURNING id`,
            [clientThomas, totalC2, (totalC2 * 0.10).toFixed(2)]
        );
        const order2 = o2.rows[0].id;

        // Sub-order Lucas (velo + casque)
        const sousTotal2a = parseFloat(velo.prix) + parseFloat(casque.prix);
        const so2a = await client.query(
            `INSERT INTO sub_orders (order_id, vendeur_id, statut, sous_total) VALUES ($1, $2, 'payee', $3) RETURNING id`,
            [order2, vendeurLucas, sousTotal2a]
        );
        const sub2a = so2a.rows[0].id;
        await client.query(
            `INSERT INTO order_items (sub_order_id, product_id, quantite, prix_unitaire, sous_total) VALUES ($1, $2, 1, $3, $3)`,
            [sub2a, velo.id, velo.prix]
        );
        await client.query(
            `INSERT INTO order_items (sub_order_id, product_id, quantite, prix_unitaire, sous_total) VALUES ($1, $2, 1, $3, $3)`,
            [sub2a, casque.id, casque.prix]
        );

        // Sub-order Sophie (tapis)
        const so2b = await client.query(
            `INSERT INTO sub_orders (order_id, vendeur_id, statut, sous_total) VALUES ($1, $2, 'payee', $3) RETURNING id`,
            [order2, vendeurSophie, tapis.prix]
        );
        const sub2b = so2b.rows[0].id;
        await client.query(
            `INSERT INTO order_items (sub_order_id, product_id, quantite, prix_unitaire, sous_total) VALUES ($1, $2, 1, $3, $3)`,
            [sub2b, tapis.id, tapis.prix]
        );

        // Payment
        await client.query(
            `INSERT INTO payments (order_id, montant, statut, methode) VALUES ($1, $2, 'accepte', 'carte')`,
            [order2, totalC2]
        );

        // Deliveries (en cours de livraison)
        await client.query(
            `INSERT INTO deliveries (sub_order_id, livreur_id, statut, adresse_livraison) VALUES ($1, $2, 'en_cours', $3)`,
            [sub2a, livreurPierre, '45 Avenue des Paulines, 63100 Clermont-Ferrand']
        );
        await client.query(
            `INSERT INTO deliveries (sub_order_id, livreur_id, statut, adresse_livraison) VALUES ($1, $2, 'prise_en_charge', $3)`,
            [sub2b, livreurMarie, '45 Avenue des Paulines, 63100 Clermont-Ferrand']
        );

        console.log('Commande #2 (en cours) creee.');

        // ========== COMMANDE 3 : Sarah achete chez Lucas (en attente livreur) ==========
        const totalC3 = parseFloat(chaussures.prix) + parseFloat(montre.prix) + parseFloat(tshirt.prix) * 2;
        const o3 = await client.query(
            `INSERT INTO orders (client_id, statut, total, commission) VALUES ($1, 'payee', $2, $3) RETURNING id`,
            [clientSarah, totalC3, (totalC3 * 0.10).toFixed(2)]
        );
        const order3 = o3.rows[0].id;

        const so3a = await client.query(
            `INSERT INTO sub_orders (order_id, vendeur_id, statut, sous_total) VALUES ($1, $2, 'payee', $3) RETURNING id`,
            [order3, vendeurLucas, totalC3]
        );
        const sub3a = so3a.rows[0].id;
        await client.query(
            `INSERT INTO order_items (sub_order_id, product_id, quantite, prix_unitaire, sous_total) VALUES ($1, $2, 1, $3, $3)`,
            [sub3a, chaussures.id, chaussures.prix]
        );
        await client.query(
            `INSERT INTO order_items (sub_order_id, product_id, quantite, prix_unitaire, sous_total) VALUES ($1, $2, 1, $3, $3)`,
            [sub3a, montre.id, montre.prix]
        );
        await client.query(
            `INSERT INTO order_items (sub_order_id, product_id, quantite, prix_unitaire, sous_total) VALUES ($1, $2, 2, $3, $4)`,
            [sub3a, tshirt.id, tshirt.prix, parseFloat(tshirt.prix) * 2]
        );

        // Payment
        await client.query(
            `INSERT INTO payments (order_id, montant, statut, methode) VALUES ($1, $2, 'accepte', 'carte')`,
            [order3, totalC3]
        );

        // Delivery (en attente livreur)
        await client.query(
            `INSERT INTO deliveries (sub_order_id, statut, adresse_livraison) VALUES ($1, 'en_attente', $2)`,
            [sub3a, '12 Rue de la Paix, 63000 Clermont-Ferrand']
        );

        console.log('Commande #3 (en attente livreur) creee.');

        // ========== COMMANDE 4 : Thomas achete chez Jean (livree) ==========
        const totalC4 = parseFloat(raquette.prix) + parseFloat(ballon.prix);
        const o4 = await client.query(
            `INSERT INTO orders (client_id, statut, total, commission) VALUES ($1, 'livree', $2, $3) RETURNING id`,
            [clientThomas, totalC4, (totalC4 * 0.10).toFixed(2)]
        );
        const order4 = o4.rows[0].id;

        const so4a = await client.query(
            `INSERT INTO sub_orders (order_id, vendeur_id, statut, sous_total) VALUES ($1, $2, 'livree', $3) RETURNING id`,
            [order4, vendeurJean, totalC4]
        );
        const sub4a = so4a.rows[0].id;
        await client.query(
            `INSERT INTO order_items (sub_order_id, product_id, quantite, prix_unitaire, sous_total) VALUES ($1, $2, 1, $3, $3)`,
            [sub4a, raquette.id, raquette.prix]
        );
        await client.query(
            `INSERT INTO order_items (sub_order_id, product_id, quantite, prix_unitaire, sous_total) VALUES ($1, $2, 1, $3, $3)`,
            [sub4a, ballon.id, ballon.prix]
        );

        await client.query(
            `INSERT INTO payments (order_id, montant, statut, methode) VALUES ($1, $2, 'accepte', 'carte')`,
            [order4, totalC4]
        );
        await client.query(
            `INSERT INTO deliveries (sub_order_id, livreur_id, statut, adresse_livraison) VALUES ($1, $2, 'livree', $3)`,
            [sub4a, livreurPierre, '45 Avenue des Paulines, 63100 Clermont-Ferrand']
        );

        console.log('Commande #4 (livree) creee.');

        // ========== COMMANDE 5 : Sarah achete chez Sophie (payee, en attente) ==========
        const totalC5 = parseFloat(halteres.prix) + parseFloat(lunettes.prix) * 2;
        const o5 = await client.query(
            `INSERT INTO orders (client_id, statut, total, commission) VALUES ($1, 'payee', $2, $3) RETURNING id`,
            [clientSarah, totalC5, (totalC5 * 0.10).toFixed(2)]
        );
        const order5 = o5.rows[0].id;

        const so5a = await client.query(
            `INSERT INTO sub_orders (order_id, vendeur_id, statut, sous_total) VALUES ($1, $2, 'payee', $3) RETURNING id`,
            [order5, vendeurSophie, totalC5]
        );
        const sub5a = so5a.rows[0].id;
        await client.query(
            `INSERT INTO order_items (sub_order_id, product_id, quantite, prix_unitaire, sous_total) VALUES ($1, $2, 1, $3, $3)`,
            [sub5a, halteres.id, halteres.prix]
        );
        await client.query(
            `INSERT INTO order_items (sub_order_id, product_id, quantite, prix_unitaire, sous_total) VALUES ($1, $2, 2, $3, $4)`,
            [sub5a, lunettes.id, lunettes.prix, parseFloat(lunettes.prix) * 2]
        );

        await client.query(
            `INSERT INTO payments (order_id, montant, statut, methode) VALUES ($1, $2, 'accepte', 'carte')`,
            [order5, totalC5]
        );
        await client.query(
            `INSERT INTO deliveries (sub_order_id, statut, adresse_livraison) VALUES ($1, 'en_attente', $2)`,
            [sub5a, '12 Rue de la Paix, 63000 Clermont-Ferrand']
        );

        console.log('Commande #5 (en attente livreur) creee.');

        // Update stock for sold products
        await client.query('UPDATE products SET stock = stock - 2 WHERE id = $1', [ballon.id]);
        await client.query('UPDATE products SET stock = stock - 1 WHERE id = $1', [maillotFr.id]);
        await client.query('UPDATE products SET stock = stock - 3 WHERE id = $1', [lunettes.id]);
        await client.query('UPDATE products SET stock = stock - 1 WHERE id = $1', [tapis.id]);
        await client.query('UPDATE products SET stock = stock - 1 WHERE id = $1', [halteres.id]);
        await client.query('UPDATE products SET stock = stock - 1 WHERE id = $1', [velo.id]);
        await client.query('UPDATE products SET stock = stock - 1 WHERE id = $1', [casque.id]);
        await client.query('UPDATE products SET stock = stock - 1 WHERE id = $1', [chaussures.id]);
        await client.query('UPDATE products SET stock = stock - 1 WHERE id = $1', [montre.id]);
        await client.query('UPDATE products SET stock = stock - 2 WHERE id = $1', [tshirt.id]);
        await client.query('UPDATE products SET stock = stock - 1 WHERE id = $1', [raquette.id]);

        console.log('Stocks mis a jour.');
        console.log('--- Seeding termine avec succes ---');

    } catch (error) {
        console.error('Erreur pendant le seeding:', error);
    } finally {
        client.release();
        await pool.end();
    }
};

seed();
