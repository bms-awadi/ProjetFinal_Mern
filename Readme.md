# Ligue Sportive Auvergne — Application MERN

Application fullstack **MERN** (MongoDB · Express · React · Node.js) avec TypeScript, gestion d'adhérents, catalogue de produits et panier, avec authentification JWT et gestion des rôles (Admin / Membre).

---

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Frontend | React 18 + TypeScript + Vite |
| Backend | Node.js + Express 5 + TypeScript + ts-node |
| Base de données | MongoDB Atlas (Mongoose) |
| Auth | JWT (`jsonwebtoken`) + bcrypt |
| Style | CSS-in-JS (inline styles) |

---

## Structure du projet

```
ProjetFinal_Mern/
├── backend/
│   ├── src/
│   │   ├── server.ts               # Point d'entrée Express
│   │   ├── config/db.ts            # Connexion MongoDB
│   │   ├── models/                 # Schémas Mongoose
│   │   │   ├── adherent.model.ts
│   │   │   ├── produit.model.ts
│   │   │   └── commande.model.ts
│   │   ├── controllers/            # Logique métier
│   │   │   ├── adherent.controller.ts
│   │   │   ├── produit.controller.ts
│   │   │   └── commande.controller.ts
│   │   └── routes/                 # Routeurs Express
│   │       ├── adherent.routes.ts
│   │       ├── produit.routes.ts
│   │       └── commande.routes.ts
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── App.tsx                 # Routing / navbar / rôles
    │   ├── api/                    # Appels fetch vers le backend
    │   ├── component/              # Composants React
    │   │   ├── page/               # Pages (Connexion, Inscription, Gestion…)
    │   │   └── form/               # Formulaires réutilisables
    │   └── model/                  # Types TypeScript partagés
    ├── .env.example
    ├── package.json
    └── vite.config.ts
```

---

## Prérequis

- **Node.js** ≥ 18
- **npm** ≥ 9
- Un cluster **MongoDB Atlas** (ou MongoDB local)

---

## Installation et lancement

### 1. Cloner le dépôt

```bash
git clone <url-du-repo>
cd ProjetFinal_Mern
```

### 2. Configurer le backend

```bash
cd backend
cp .env.example .env
```

Éditer `.env` :

```dotenv
MONGO_URI=mongodb+srv://<user>:<motdepasse>@mernstarter.afbuien.mongodb.net/?appName=<db_name>
PORT=3001
JWT_SECRET=<votre_clé_secrète_longue>
```

Installer les dépendances et démarrer :

```bash
npm install
npm run start
```

> Le serveur écoute sur `http://localhost:3001`

### 3. Configurer le frontend

```bash
cd ../frontend
cp .env.example .env
```

Éditer `.env` :

```dotenv
VITE_API_URL=http://localhost:3001/api
```

Installer les dépendances et démarrer :

```bash
npm install
npm run dev
```

> L'application est accessible sur `http://localhost:5173`

---

## Fonctionnalités

### Authentification
- Inscription d'un nouvel adhérent
- Connexion par email / mot de passe (token JWT stocké en `localStorage`)
- Déconnexion
- Protection côté frontend : expiration de token vérifiée à chaque chargement

### Rôles
| Rôle | Accès |
|------|-------|
| **Adherent** | Catalogue, Panier |
| **Admin** | Catalogue, Panier, Gestion Adhérents, Gestion Produits |

### Catalogue & Panier
- Affichage des produits disponibles
- Ajout / retrait de produits dans le panier
- Validation de commande

### Gestion (Admin uniquement)
- CRUD complet sur les adhérents
- CRUD complet sur les produits

---

## Routes API

### Adhérents `/api/adherents`

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/` | Lister tous les adhérents |
| `GET` | `/:id` | Obtenir un adhérent par ID |
| `POST` | `/` | Créer un adhérent |
| `PUT` | `/:id` | Modifier un adhérent |
| `DELETE` | `/:id` | Supprimer un adhérent |
| `POST` | `/login` | Connexion (retourne un JWT) |

### Produits `/api/produits`

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/` | Lister tous les produits |
| `GET` | `/:id` | Obtenir un produit par ID |
| `POST` | `/` | Créer un produit |
| `PUT` | `/:id` | Modifier un produit |
| `DELETE` | `/:id` | Supprimer un produit |

### Commandes `/api/commandes`

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/` | Lister toutes les commandes |
| `GET` | `/:id` | Obtenir une commande par ID |
| `POST` | `/` | Créer une commande |
| `PUT` | `/:id` | Modifier une commande |
| `DELETE` | `/:id` | Supprimer une commande |

---

## Variables d'environnement

### Backend (`.env`)

| Variable | Description | Exemple |
|----------|-------------|---------|
| `MONGO_URI` | URI de connexion MongoDB Atlas | `mongodb+srv://...` |
| `PORT` | Port du serveur Express | `3001` |
| `JWT_SECRET` | Clé secrète pour signer les tokens JWT | chaîne aléatoire longue |

### Frontend (`.env`)

| Variable | Description | Exemple |
|----------|-------------|---------|
| `VITE_API_URL` | URL de base de l'API backend | `http://localhost:3001/api` |

---

## Scripts disponibles

### Backend

```bash
npm run start   # Lance le serveur avec ts-node
```

### Frontend

```bash
npm run dev     # Lance Vite en mode développement
npm run build   # Build de production
npm run preview # Prévisualisation du build
```
