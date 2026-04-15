import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: Number(process.env.DB_PORT),
});

const connectDB = async (): Promise<void> => {
    try {
        const client = await pool.connect();
        console.log("Connected to the database successfully!");
        client.release();
    } catch (error) {
        console.error(`Error: ${(error as Error).message}`);
        process.exit(1);
    }
};

export { pool };
export default connectDB;
// commande pour tester la connexion à la base de données :
// npx ts-node src/config/db.ts