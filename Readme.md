Back : 
cd backend
Dans le terminal intégré de VS Code, lancez ces commandes une par une :
1. Initialisation du projet : npm init -y
2. Installation des outils TypeScript et MongoDB (Mongoose) : npm install mongoose 
npm install typescript ts-node @types/node @types/mongoose --save-dev
3. Initialisation de la configuration TypeScript : npx tsc --init
4. Express : npm install express / npm i --save-dev @types/express 
5. cors : npm install cors; npm install @types/cors --save-dev                

Front : 
cd frontend
npm create vite@latest . -- --template react-ts



Back : --- Maxime
- 2 CRUD
- Base de données

Front :
- htlm (connexion/inscription + Dashboard) --- Gurvan
- Fonction : --- Awadi
	- affichertout
	- Panier
	- Gestion des stock
- admin -> Gestion des produit+clients --- nous 3

Presentation + Rapport --- Gurvan


Adhérents : (_id), Nom, Prenom, role, mdp (hashé), email
Produits : (_id), Nom, Stock, Cathegorie, prix
Commandes : _id (Adhérent), _id (Produit), quantité, date

export interface IProduit extends Document {
    nom: string;
    stock: number;
    categorie: string;
    prix: number;
}

export interface IAdherent extends Document {
    nom: string;
    prenom: string;
    role: string;
    mdp: string;
    email: string;
}

export interface ICommande extends Document {
    adherent: mongoose.Types.ObjectId;
    produit: mongoose.Types.ObjectId;
    quantite: number;
}