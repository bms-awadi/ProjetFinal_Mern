import { useState } from 'react';
import { PanierProvider } from './component/ContenuPanier';
import Catalogue from './component/CatalogueProduits';
import Panier from './component/Panier';
import AjoutProduit from './component/page/AjoutProduit';
import Connexion from './component/page/Connexion';
import Inscription from './component/page/Inscription';
import { deconnexion, estConnecte } from './api/adherent';
import './App.css';

type Page = 'connexion' | 'inscription' | 'catalogue' | 'panier' | 'ajout';

function App() {
  const [page, setPage] = useState<Page>(estConnecte() ? 'catalogue' : 'connexion');

  const handleDeconnexion = () => {
    deconnexion();
    setPage('connexion');
  };

  return (
    <PanierProvider>
      {/* Navbar visible uniquement si connecte */}
      {(page === 'catalogue' || page === 'panier' || page === 'ajout') && (
        <nav style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '16px', alignItems: 'center' }}>
          <button
            onClick={() => setPage('catalogue')}
            className={`px-4 py-2 rounded font-semibold ${page === 'catalogue'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
          >
            Catalogue
          </button>
          <button
            onClick={() => setPage('panier')}
            className={`px-4 py-2 rounded font-semibold ${page === 'panier'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
          >
            Mon Panier
          </button>
          <button
            onClick={() => setPage('ajout')}
            className={`px-4 py-2 rounded font-semibold ${page === 'ajout'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
              }`}
          >
            Ajouter Produit
          </button>
          <button
            onClick={handleDeconnexion}
            className="ml-auto px-4 py-2 rounded font-semibold bg-red-500 text-white hover:bg-red-600"
          >
            Se deconnecter
          </button>
        </nav>
      )}

      {page === 'connexion' && (
        <Connexion
          onConnecte={() => setPage('catalogue')}
          onSwitchInscription={() => setPage('inscription')}
        />
      )}
      {page === 'inscription' && (
        <Inscription
          onSwitchConnexion={() => setPage('connexion')}
        />
      )}
      {page === 'catalogue' && <Catalogue />}
      {page === 'panier' && <Panier />}
      {page === 'ajout' && <AjoutProduit />}
    </PanierProvider>
  );
}

export default App;