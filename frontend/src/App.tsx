import { useState } from 'react';
import { PanierProvider } from './component/ContenuPanier';
import Catalogue from './component/CatalogueProduits';
import Panier from './component/Panier';
import Connexion from './component/page/Connexion';
import Inscription from './component/page/Inscription';
import GestionAdherents from './component/page/GestionAdherents';
import GestionProduits from './component/page/GestionProduits';
import AdminDashboard from './component/page/AdminDashboard';
import LivreurDashboard from './component/page/LivreurDashboard';
import VendeurCommandes from './component/page/VendeurCommandes';
import { deconnexion, estConnecte, getAdherentConnecte } from './api/adherent';
import './App.css';

type Page =
  | 'connexion'
  | 'inscription'
  | 'catalogue'
  | 'panier'
  | 'gestion-produits'
  | 'vendeur-commandes'
  | 'livreur-dashboard'
  | 'gestion-adherents'
  | 'admin-dashboard';

const roleColors: Record<string, { bg: string; text: string; border: string }> = {
  client: { bg: 'rgba(59,130,246,0.2)', text: '#93c5fd', border: 'rgba(59,130,246,0.4)' },
  vendeur: { bg: 'rgba(34,197,94,0.2)', text: '#86efac', border: 'rgba(34,197,94,0.4)' },
  livreur: { bg: 'rgba(245,158,11,0.2)', text: '#fcd34d', border: 'rgba(245,158,11,0.4)' },
  admin: { bg: 'rgba(239,68,68,0.2)', text: '#fca5a5', border: 'rgba(239,68,68,0.4)' },
};

function App() {
  const [page, setPage] = useState<Page>(estConnecte() ? 'catalogue' : 'connexion');
  const user = getAdherentConnecte();
  const role = user?.role || 'client';

  const handleDeconnexion = () => {
    deconnexion();
    setPage('connexion');
  };

  const handleConnecte = () => {
    const u = getAdherentConnecte();
    if (!u) { setPage('catalogue'); return; }
    switch (u.role) {
      case 'vendeur': setPage('gestion-produits'); break;
      case 'livreur': setPage('livreur-dashboard'); break;
      case 'admin': setPage('admin-dashboard'); break;
      default: setPage('catalogue');
    }
  };

  interface NavItem { key: Page; label: string; roles: string[]; }

  const pagesNavigation: NavItem[] = [
    { key: 'catalogue', label: 'Catalogue', roles: ['client', 'admin'] },
    { key: 'panier', label: 'Mon Panier', roles: ['client', 'admin'] },
    { key: 'gestion-produits', label: 'Mes Produits', roles: ['vendeur'] },
    { key: 'vendeur-commandes', label: 'Mes Commandes', roles: ['vendeur'] },
    { key: 'livreur-dashboard', label: 'Livraisons', roles: ['livreur'] },
    { key: 'gestion-adherents', label: 'Utilisateurs', roles: ['admin'] },
    { key: 'gestion-produits', label: 'Produits', roles: ['admin'] },
    { key: 'admin-dashboard', label: 'Statistiques', roles: ['admin'] },
  ];

  const pagesVisibles = pagesNavigation.filter((p) => p.roles.includes(role));

  // Security: redirect if page not allowed for role
  const allowedPages = pagesVisibles.map((p) => p.key);
  const pageEffective: Page =
    page === 'connexion' || page === 'inscription'
      ? page
      : allowedPages.includes(page)
        ? page
        : allowedPages[0] || 'catalogue';

  const rc = roleColors[role] || roleColors.client;

  return (
    <PanierProvider>
      {pageEffective !== 'connexion' && pageEffective !== 'inscription' && (
        <nav style={{
          backgroundImage: "url('/src/assets/fond1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
          padding: "0 32px",
          display: "flex",
          alignItems: "center",
          minHeight: "90px",
          boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
        }}>
          {/* Overlay */}
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.52)", zIndex: 0 }} />

          {/* Logo + Titre */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", zIndex: 1, marginRight: "auto" }}>
            <img src="/src/assets/logo.png" style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.5)" }} />
            <span style={{ color: "white", fontWeight: 800, fontSize: "1.35rem", letterSpacing: "0.04em", whiteSpace: "nowrap" }}>
              Ligue Sportive Auvergne
            </span>
          </div>

          {/* Navigation buttons */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", zIndex: 1 }}>
            {pagesVisibles.map(({ key, label }, i) => (
              <button
                key={key + '-' + i}
                onClick={() => setPage(key)}
                style={{
                  padding: "8px 18px",
                  borderRadius: "9999px",
                  border: "none",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  cursor: "pointer",
                  background: pageEffective === key ? "white" : "rgba(255,255,255,0.12)",
                  color: pageEffective === key ? "#1d4ed8" : "white",
                  transition: "background 0.2s",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          {/* User info + logout */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", zIndex: 1, marginLeft: "24px" }}>
            {user && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.82rem" }}>
                  Bonjour, <strong>{user.prenom} {user.nom}</strong>
                </span>
                <span style={{
                  fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px",
                  borderRadius: "9999px",
                  background: rc.bg, color: rc.text,
                  border: "1px solid " + rc.border,
                  textTransform: "capitalize",
                }}>
                  {role}
                </span>
              </div>
            )}
            <button
              onClick={handleDeconnexion}
              style={{
                padding: "6px 14px", borderRadius: "9999px", border: "none",
                fontSize: "0.8rem", fontWeight: 600, cursor: "pointer",
                background: "#ef4444", color: "white",
              }}
            >
              Se deconnecter
            </button>
          </div>
        </nav>
      )}

      {pageEffective === 'connexion' && <Connexion onConnecte={handleConnecte} />}
      {pageEffective === 'inscription' && <Inscription onClose={() => setPage('connexion')} />}
      {pageEffective === 'catalogue' && <Catalogue />}
      {pageEffective === 'panier' && <Panier />}
      {pageEffective === 'gestion-produits' && <GestionProduits />}
      {pageEffective === 'vendeur-commandes' && <VendeurCommandes />}
      {pageEffective === 'livreur-dashboard' && <LivreurDashboard />}
      {pageEffective === 'gestion-adherents' && <GestionAdherents />}
      {pageEffective === 'admin-dashboard' && <AdminDashboard />}
    </PanierProvider>
  );
}

export default App;
