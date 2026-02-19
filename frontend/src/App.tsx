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

  const handleDeconnexion = () => {
    deconnexion();
    setPage('connexion');
  };

  return (
    <PanierProvider>
      {(page === 'catalogue' || page === 'panier' || page === 'GestionAdherents' || page === 'GestionProduits') && (
        <nav className="bg-blue-700 text-white px-8 py-3 flex items-center gap-4 shadow-lg">
          <span className="text-xl font-extrabold tracking-wide mr-6">
            Ligue Sportive Auvergne
          </span>
          <button
            onClick={() => setPage('catalogue')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${page === 'catalogue' ? 'bg-white text-blue-700' : 'hover:bg-blue-600'
              }`}
          >
            Catalogue
          </button>
          <button
            onClick={() => setPage('panier')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${page === 'panier' ? 'bg-white text-blue-700' : 'hover:bg-blue-600'
              }`}
          >
            Mon Panier
          </button>
          <button
            onClick={() => setPage('GestionAdherents')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${page === 'GestionAdherents' ? 'bg-white text-blue-700' : 'hover:bg-blue-600'
              }`}
          >
            GestionAdherents
          </button>
          <button
            onClick={() => setPage('GestionProduits')}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition ${page === 'GestionProduits' ? 'bg-white text-blue-700' : 'hover:bg-blue-600'
              }`}
          >
            GestionProduits
          </button>
          <div className="ml-auto flex items-center gap-4">
            {adherent && (
              <span className="text-sm opacity-90">
                Bonjour, <strong>{adherent.prenom} {adherent.nom}</strong>
              </span>
            )}
            <button
              onClick={handleDeconnexion}
              className="px-4 py-2 rounded-full text-sm font-semibold bg-red-500 hover:bg-red-600 transition"
            >
              Se deconnecter
            </button>
          </div>
        </nav>
      )}

      {/* Inscription n'est plus une page, c'est un popup géré dans Connexion */}
      {page === 'connexion' && <Connexion onConnecte={() => setPage('catalogue')} />}
      {page === 'catalogue' && <Catalogue />}
      {page === 'panier' && <Panier />}
      {page === 'GestionAdherents' && <GestionAdherents />}
      {page === 'GestionProduits' && <GestionProduits />}
    </PanierProvider>
  );
}

export default App;