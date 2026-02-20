import { useState } from 'react';
import { PanierProvider } from './component/ContenuPanier';
import Catalogue from './component/CatalogueProduits';
import Panier from './component/Panier';
import Connexion from './component/page/Connexion';
import { deconnexion, estConnecte, getAdherentConnecte } from './api/adherent';
import GestionAdherents from './component/page/GestionAdherents';
import GestionProduits from './component/page/GestionProduits';
import './App.css';

type Page = 'connexion' | 'catalogue' | 'panier' | 'GestionAdherents' | 'GestionProduits';

function App() {
  const [page, setPage] = useState<Page>(estConnecte() ? 'catalogue' : 'connexion');
  const adherent = getAdherentConnecte();
  console.log('Adhérent connecté :', adherent);
  const isAdmin = adherent?.role === 'Admin';

  const handleDeconnexion = () => {
    deconnexion();
    setPage('connexion');
  };

  // Pages accessibles selon le rôle
  const pagesNavigation: { key: Page; label: string; adminOnly: boolean }[] = [
    { key: 'catalogue', label: 'Catalogue', adminOnly: false },
    { key: 'panier', label: 'Mon Panier', adminOnly: false },
    { key: 'GestionAdherents', label: 'Gestion Adhérents', adminOnly: true },
    { key: 'GestionProduits', label: 'Gestion Produits', adminOnly: true },
  ];

  const pagesVisibles = pagesNavigation.filter(p => !p.adminOnly || isAdmin);

  // Sécurité : si un membre tente d'accéder à une page admin, on le redirige
  const pageEffective: Page =
    (page === 'GestionAdherents' || page === 'GestionProduits') && !isAdmin
      ? 'catalogue'
      : page;

  return (
    <PanierProvider>
      {pageEffective !== 'connexion' && (
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

          {/* Boutons navigation filtrés selon le rôle */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px", zIndex: 1 }}>
            {pagesVisibles.map(({ key, label }) => (
              <button
                key={key}
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

          {/* Utilisateur + badge rôle + déconnexion */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px", zIndex: 1, marginLeft: "24px" }}>
            {adherent && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ color: "rgba(255,255,255,0.9)", fontSize: "0.82rem" }}>
                  Bonjour, <strong>{adherent.prenom} {adherent.nom}</strong>
                </span>
                <span style={{
                  fontSize: "0.7rem", fontWeight: 700, padding: "2px 8px",
                  borderRadius: "9999px",
                  background: isAdmin ? "rgba(234,179,8,0.25)" : "rgba(255,255,255,0.15)",
                  color: isAdmin ? "#fde68a" : "rgba(255,255,255,0.7)",
                  border: `1px solid ${isAdmin ? "rgba(234,179,8,0.5)" : "rgba(255,255,255,0.2)"}`,
                }}>
                  {isAdmin ? "Admin" : "Membre"}
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
              Se déconnecter
            </button>
          </div>
        </nav>
      )}

      {pageEffective === 'connexion' && <Connexion onConnecte={() => setPage('catalogue')} />}
      {pageEffective === 'catalogue' && <Catalogue />}
      {pageEffective === 'panier' && <Panier />}
      {pageEffective === 'GestionAdherents' && <GestionAdherents />}
      {pageEffective === 'GestionProduits' && <GestionProduits />}
    </PanierProvider>
  );
}

export default App;