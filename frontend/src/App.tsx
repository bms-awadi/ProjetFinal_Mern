import { useState } from 'react';
import { PanierProvider } from './component/ContenuPanier';
import Catalogue from './component/CatalogueProduits';
import Panier from './component/Panier';
import AjoutProduit from './component/AjoutProduit';
import './App.css';

function App() {
  // Navigation simple sans React Router pour tester
  const [page, setPage] = useState<'catalogue' | 'panier' | 'ajout'>('catalogue');

  return (
    <PanierProvider>
      {/* Barre de navigation */}
      <nav style={{ padding: '12px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', gap: '16px' }}>
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
      </nav>

      {/* Affichage conditionnel des pages */}
      {page === 'catalogue' && <Catalogue />}
      {page === 'panier' && <Panier />}
      {page === 'ajout' && <AjoutProduit />}
    </PanierProvider>
  );
}

export default App;