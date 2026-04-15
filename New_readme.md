# Plateforme Multi-Vendeur de Livraison — Architecture N-Tiers

Transformation d'une application MERN (MongoDB/Express/React/Node.js) en plateforme multi-vendeur de gestion de livraisons avec **PostgreSQL** et architecture **N-Tiers** (Controller → Service → Repository).

---

## Ce qui a changé (AVANT → APRES)

### Base de données : MongoDB → PostgreSQL

| Avant | Après |
|-------|-------|
| MongoDB Atlas + Mongoose ODM | PostgreSQL + `pg` (requêtes SQL directes) |
| 3 collections : `adherents`, `produits`, `commandes` | 8 tables : `users`, `categories`, `products`, `orders`, `sub_orders`, `order_items`, `payments`, `deliveries` |
| IDs MongoDB (`_id` string ObjectId) | IDs numériques auto-incrémentés (`id SERIAL`) |
| Pas de relations | Relations avec clés étrangères + contraintes CHECK |

**Fichiers modifiés :**
- `backend/src/config/db.ts` — Déjà configuré avec `pg` Pool (non modifié)
- `backend/package.json` — Supprimé `mongoose`, `axios`, `@types/mongoose` ; Ajouté `pg`, `@types/pg`, `jest`, `ts-jest`

**Fichiers créés :**
- `backend/src/sql/init.sql` — Schéma complet (DROP/CREATE des 8 tables + indexes + seed catégories)
- `backend/src/config/init-db.ts` — Script d'initialisation (exécute `init.sql` + seed utilisateurs de démo)

### Architecture : Monolithique → N-Tiers

| Avant | Après |
|-------|-------|
| Controller = logique métier + accès DB | Architecture 3 couches séparées |
| 3 controllers avec Mongoose inline | Controller → Service → Repository |
| Pas de middleware auth | Middleware JWT + contrôle de rôles |

**Nouvelle couche Repository (accès données) :**
- `backend/src/repositories/user.repository.ts` — CRUD users
- `backend/src/repositories/product.repository.ts` — CRUD products + catégories, supporte transactions
- `backend/src/repositories/order.repository.ts` — Commandes, sous-commandes, items (avec transactions)
- `backend/src/repositories/delivery.repository.ts` — Livraisons, assignation livreur
- `backend/src/repositories/payment.repository.ts` — Paiements

**Nouvelle couche Service (logique métier) :**
- `backend/src/services/auth.service.ts` — Inscription (hash bcrypt), connexion (génère JWT 24h)
- `backend/src/services/user.service.ts` — Gestion utilisateurs, statistiques
- `backend/src/services/product.service.ts` — CRUD produits avec vérification propriétaire
- `backend/src/services/order.service.ts` — Création commande transactionnelle (split par vendeur, `SELECT ... FOR UPDATE` pour le stock, commission 10%)
- `backend/src/services/delivery.service.ts` — Assignation livreur (max 5 actives), cascade statuts

**Nouveaux controllers :**
- `backend/src/controllers/auth.controller.ts`
- `backend/src/controllers/user.controller.ts`
- `backend/src/controllers/product.controller.ts`
- `backend/src/controllers/order.controller.ts`
- `backend/src/controllers/delivery.controller.ts`

**Nouvelles routes :**
- `backend/src/routes/auth.routes.ts` — `/api/auth` (public)
- `backend/src/routes/user.routes.ts` — `/api/users` (admin)
- `backend/src/routes/product.routes.ts` — `/api/products` (GET public, POST/PUT/DELETE vendeur/admin)
- `backend/src/routes/order.routes.ts` — `/api/orders` (client crée, vendeur voit les siennes, admin tout)
- `backend/src/routes/delivery.routes.ts` — `/api/deliveries` (livreur assigne/met à jour, admin voit tout)

**Middleware créé :**
- `backend/src/middleware/auth.middleware.ts` — `authenticateToken` + `authorizeRoles(...roles)`

**Fichier modifié :**
- `backend/src/server.ts` — Importe les nouvelles routes au lieu des anciennes

### Rôles : 2 → 4

| Avant | Après |
|-------|-------|
| Admin / Membre | Client / Vendeur / Livreur / Admin |

### Frontend : Mises à jour

**Modèles (`frontend/src/model/`) :**
- `adherent.ts` — `Adherent` → `User`, `_id` string → `id` number, ajout `telephone`, `adresse`
- `produit.ts` — Ajout `description`, `categorie_id/nom`, `vendeur_id/nom/prenom`
- `commande.ts` — Réécriture complète : `Order`, `SubOrder`, `OrderItem`, `CartItemPayload`
- `delivery.ts` — **NOUVEAU** : interface `Delivery`

**API (`frontend/src/api/`) :**
- `config.ts` — Ajout fonction `authHeader()` (Bearer token)
- `adherent.ts` — Endpoints `/api/auth/login`, `/api/auth/register`, `/api/users/*`. Ajout `inscription()`, `getUsersByRole()`
- `produit.ts` — Endpoints `/api/products/*`. Ajout `getProduitsVendeur()`, `getCategories()`
- `commande.ts` — Endpoints `/api/orders/*`. Ajout `createOrder()`, `payOrder()`, `getVendeurOrders()`, `getOrderStats()`
- `delivery.ts` — **NOUVEAU** : `getAvailableDeliveries()`, `assignDelivery()`, `updateDeliveryStatus()`...

**Composants (`frontend/src/component/`) :**
- `ContenuPanier.tsx` — `_id` → `id`, comparaisons numériques
- `CatalogueProduits.tsx` — `_id` → `id`, `categorie` → `categorie_nom`
- `Panier.tsx` — Réécriture complète (adresse de livraison, création commande, paiement simulé, historique)
- `page/Connexion.tsx` — Réécriture (`password` au lieu de `mdp`, lien démo)
- `page/Inscription.tsx` — Réécriture (sélection du rôle : client/vendeur/livreur)
- `page/GestionProduits.tsx` — Réécriture (CRUD vendeur + vue admin, catégories)
- `page/GestionAdherents.tsx` — Réécriture (filtre par rôle, changement de rôle en direct)
- `page/AdminDashboard.tsx` — **NOUVEAU** : statistiques, CA, commissions, compteurs utilisateurs
- `page/LivreurDashboard.tsx` — **NOUVEAU** : livraisons disponibles, assignation, mise à jour statut
- `page/VendeurCommandes.tsx` — **NOUVEAU** : sous-commandes du vendeur avec détails items

**App.tsx — Navigation par rôle :**
- Client → Catalogue, Mon Panier
- Vendeur → Mes Produits, Mes Commandes
- Livreur → Livraisons
- Admin → Catalogue, Utilisateurs, Produits, Statistiques

### Anciens fichiers (encore présents mais plus importés)

Ces fichiers de l'ancienne version existent toujours mais ne sont plus utilisés :
- `backend/src/models/adherent.model.ts`, `produit.model.ts`, `commande.model.ts` — Schémas Mongoose
- `backend/src/controllers/adherent.controller.ts`, `produit.controller.ts`, `commande.controller.ts` — Anciens controllers
- `backend/src/routes/adherent.routes.ts`, `produit.routes.ts`, `commande.routes.ts` — Anciennes routes
- `frontend/src/component/page/AjoutAdherent.tsx`, `AjoutProduit.tsx`, `ModifierAdherent.tsx`, `ModifierProduit.tsx` — Anciens formulaires
- `frontend/src/component/form/FormAdherent.tsx`, `FormProduit.tsx` — Anciens composants formulaire

Vous pouvez les supprimer sans impact.

---

## Stack technique actuelle

| Couche | Technologie |
|--------|-------------|
| Frontend | React 19 + TypeScript + Vite 7 |
| Backend | Node.js + Express 5 + TypeScript + ts-node |
| Base de données | **PostgreSQL** (`pg`) |
| Auth | JWT (`jsonwebtoken`) + bcrypt |
| Tests | Jest + ts-jest |
| Style | CSS-in-JS (inline styles) |
| Architecture | **N-Tiers** (Controller → Service → Repository) |

---

## Structure du projet (nouvelle)

```
ProjetFinal_Mern/
├── backend/
│   ├── src/
│   │   ├── server.ts                  # Point d'entrée Express
│   │   ├── config/
│   │   │   ├── db.ts                  # Pool de connexion PostgreSQL
│   │   │   └── init-db.ts            # Script initialisation DB
│   │   ├── sql/
│   │   │   └── init.sql              # Schéma SQL (8 tables)
│   │   ├── middleware/
│   │   │   └── auth.middleware.ts     # JWT + autorisation par rôle
│   │   ├── repositories/             # Couche ACCES DONNEES
│   │   │   ├── user.repository.ts
│   │   │   ├── product.repository.ts
│   │   │   ├── order.repository.ts
│   │   │   ├── delivery.repository.ts
│   │   │   └── payment.repository.ts
│   │   ├── services/                  # Couche LOGIQUE METIER
│   │   │   ├── auth.service.ts
│   │   │   ├── user.service.ts
│   │   │   ├── product.service.ts
│   │   │   ├── order.service.ts
│   │   │   └── delivery.service.ts
│   │   ├── controllers/               # Couche PRESENTATION
│   │   │   ├── auth.controller.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── product.controller.ts
│   │   │   ├── order.controller.ts
│   │   │   └── delivery.controller.ts
│   │   └── routes/
│   │       ├── auth.routes.ts
│   │       ├── user.routes.ts
│   │       ├── product.routes.ts
│   │       ├── order.routes.ts
│   │       └── delivery.routes.ts
│   ├── package.json
│   └── tsconfig.json
└── frontend/
    ├── src/
    │   ├── App.tsx                    # Navigation par rôle
    │   ├── api/
    │   │   ├── config.ts              # URL de base + authHeader()
    │   │   ├── adherent.ts            # Auth + CRUD users
    │   │   ├── produit.ts             # CRUD produits
    │   │   ├── commande.ts            # Commandes + stats
    │   │   └── delivery.ts            # Livraisons
    │   ├── model/
    │   │   ├── adherent.ts            # Interface User
    │   │   ├── produit.ts             # Interface Produit
    │   │   ├── commande.ts            # Order, SubOrder, OrderItem
    │   │   └── delivery.ts            # Interface Delivery
    │   └── component/
    │       ├── CatalogueProduits.tsx
    │       ├── ContenuPanier.tsx       # Context panier
    │       ├── Panier.tsx              # Panier + commande + paiement
    │       └── page/
    │           ├── Connexion.tsx
    │           ├── Inscription.tsx
    │           ├── GestionProduits.tsx  # Vendeur/Admin
    │           ├── GestionAdherents.tsx # Admin
    │           ├── AdminDashboard.tsx   # Admin stats
    │           ├── LivreurDashboard.tsx # Livreur
    │           └── VendeurCommandes.tsx # Vendeur
    ├── package.json
    └── vite.config.ts
```

---

## Prérequis

- **Node.js** >= 18
- **npm** >= 9
- **PostgreSQL** >= 14 (local ou hébergé)

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
npm install
```

Créer un fichier `.env` :

```dotenv
DB_USER=postgres
DB_HOST=localhost
DB_NAME=livraison_db
DB_PASSWORD=votre_mot_de_passe
DB_PORT=5432
PORT=3001
JWT_SECRET=votre_cle_secrete_longue
```

Créer la base de données PostgreSQL :
```bash
createdb livraison_db
```

Initialiser le schéma et les données de démo :
```bash
npm run init-db
```

Démarrer le serveur :
```bash
npm run start
# ou en mode développement (rechargement auto) :
npm run dev
```

> Le serveur écoute sur `http://localhost:3001`

### 3. Configurer le frontend

```bash
cd ../frontend
npm install
```

Créer un fichier `.env` :

```dotenv
VITE_API_URL=http://localhost:3001/api
```

Démarrer :

```bash
npm run dev
```

> L'application est accessible sur `http://localhost:5173`

### 4. Comptes de démo (créés par init-db)

| Role | Email | Mot de passe |
|------|-------|-------------|
| Admin | `admin@livraison.com` | `admin123` |
| Vendeur | `vendeur@livraison.com` | `vendeur123` |
| Livreur | `livreur@livraison.com` | `livreur123` |

---

## Fonctionnalités par rôle

### Client
- Consulter le catalogue de produits (filtré par catégorie)
- Ajouter/retirer des produits au panier
- Passer une commande (avec adresse de livraison)
- Simulation de paiement
- Consulter l'historique de ses commandes

### Vendeur
- Gérer ses propres produits (CRUD)
- Consulter les sous-commandes qui lui sont destinées
- Voir le statut de livraison de ses commandes

### Livreur
- Voir les livraisons disponibles (non assignées)
- Prendre en charge une livraison (max 5 actives simultanément)
- Mettre à jour le statut : prise en charge → en cours → livrée

### Administrateur
- Tableau de bord : CA total, commissions, nombre de commandes
- Compteurs par rôle (clients, vendeurs, livreurs, admins)
- Gestion des utilisateurs (modifier rôle, supprimer)
- Vue globale des produits et commandes
- Vue des livraisons récentes

---

## Règles métier

| Règle | Implémentation |
|-------|----------------|
| Commission plateforme | 10% sur chaque commande |
| Split commande par vendeur | Chaque commande génère autant de sous-commandes (`sub_orders`) que de vendeurs distincts |
| Gestion concurrente du stock | `SELECT ... FOR UPDATE` dans une transaction PostgreSQL |
| Limite livraisons par livreur | Maximum 5 livraisons actives simultanément |
| Cascade statut livraison | Quand toutes les sous-commandes sont livrées, la commande principale passe en statut "livrée" |

---

## Routes API

### Auth `/api/auth` (public)

| Méthode | Route | Description |
|---------|-------|-------------|
| `POST` | `/register` | Inscription (retourne un JWT) |
| `POST` | `/login` | Connexion (retourne un JWT) |

### Users `/api/users` (admin)

| Méthode | Route | Description |
|---------|-------|-------------|
| `GET` | `/` | Lister tous les utilisateurs |
| `GET` | `/stats` | Statistiques utilisateurs |
| `GET` | `/profile` | Profil de l'utilisateur connecté |
| `GET` | `/role/:role` | Filtrer par rôle |
| `GET` | `/:id` | Obtenir un utilisateur par ID |
| `PUT` | `/:id` | Modifier un utilisateur |
| `DELETE` | `/:id` | Supprimer un utilisateur |

### Products `/api/products`

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| `GET` | `/` | Lister tous les produits | Public |
| `GET` | `/categories` | Lister les catégories | Public |
| `GET` | `/me` | Produits du vendeur connecté | Vendeur |
| `GET` | `/:id` | Obtenir un produit par ID | Public |
| `POST` | `/` | Créer un produit | Vendeur/Admin |
| `PUT` | `/:id` | Modifier un produit | Vendeur/Admin |
| `DELETE` | `/:id` | Supprimer un produit | Vendeur/Admin |

### Orders `/api/orders`

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| `GET` | `/` | Toutes les commandes | Admin |
| `GET` | `/me` | Commandes du client connecté | Client |
| `GET` | `/vendeur` | Sous-commandes du vendeur | Vendeur |
| `GET` | `/stats` | Statistiques commandes | Admin |
| `GET` | `/:id` | Détail commande | Auth |
| `POST` | `/` | Créer une commande | Client |
| `POST` | `/:id/pay` | Simuler le paiement | Client |

### Deliveries `/api/deliveries`

| Méthode | Route | Description | Auth |
|---------|-------|-------------|------|
| `GET` | `/` | Toutes les livraisons | Admin |
| `GET` | `/available` | Livraisons disponibles | Livreur |
| `GET` | `/me` | Mes livraisons | Livreur |
| `POST` | `/:id/assign` | Prendre en charge | Livreur |
| `PUT` | `/:id/status` | Mettre à jour statut | Livreur |

---

## Variables d'environnement

### Backend (`.env`)

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DB_USER` | Utilisateur PostgreSQL | `postgres` |
| `DB_HOST` | Hôte PostgreSQL | `localhost` |
| `DB_NAME` | Nom de la base | `livraison_db` |
| `DB_PASSWORD` | Mot de passe PostgreSQL | `votre_mdp` |
| `DB_PORT` | Port PostgreSQL | `5432` |
| `PORT` | Port du serveur Express | `3001` |
| `JWT_SECRET` | Clé secrète JWT | chaîne aléatoire longue |

### Frontend (`.env`)

| Variable | Description | Exemple |
|----------|-------------|---------|
| `VITE_API_URL` | URL de base de l'API backend | `http://localhost:3001/api` |

---

## Scripts disponibles

### Backend

```bash
npm run start     # Lance le serveur avec ts-node
npm run dev       # Mode développement avec nodemon (rechargement auto)
npm run init-db   # Initialise le schéma + données de démo
npm run test      # Lance les tests Jest
```

### Frontend

```bash
npm run dev       # Lance Vite en mode développement
npm run build     # Build de production
npm run preview   # Prévisualisation du build
```

---

## Schéma de la base de données

```
users ──────────────────┐
  id, nom, prenom,      │
  email, password,       │
  role, telephone,       │
  adresse                │
                         │
categories               │
  id, nom                │
                         │
products ────────────────┤
  id, nom, description,  │
  prix, stock,           │
  categorie_id → categories
  vendeur_id → users     │
                         │
orders ──────────────────┤
  id, client_id → users  │
  total, commission,     │
  statut, adresse_livraison
                         │
sub_orders ──────────────┤
  id, order_id → orders  │
  vendeur_id → users     │
  sous_total, statut     │
                         │
order_items              │
  id, sub_order_id       │
  → sub_orders           │
  product_id → products  │
  quantite, prix_unitaire│
                         │
payments                 │
  id, order_id → orders  │
  montant, methode,      │
  statut                 │
                         │
deliveries               │
  id, sub_order_id       │
  → sub_orders           │
  livreur_id → users     │
  statut, adresse        │
```
