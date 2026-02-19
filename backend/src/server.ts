import express from 'express';
import commande from './routes/commande.routes'
import produit from './routes/produit.routes'
import adherent from './routes/adherent.routes';
import cors from 'cors';
import connectDB from './config/db';

const app = express();
const PORT = process.env.PORT || 3001;

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/commandes', commande);
app.use('/api/produits', produit);
app.use('/api/adherents', adherent);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
