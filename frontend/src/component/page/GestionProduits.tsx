import { useEffect, useState } from "react";
import { Produit } from "../../model/produit";
import { getProduits, deleteProduit } from "../../api/produit";
import AjoutProduit from "./AjoutProduit";
import ModifierProduit from "./ModifierProduit";

const GestionProduits = () => {
    const [produits, setProduits] = useState<Produit[]>([]);
    const [loading, setLoading] = useState(true);
    const [vue, setVue] = useState<'liste' | 'ajout' | 'modifier'>('liste');
    const [produitSelectionne, setProduitSelectionne] = useState<Produit | null>(null);

    const charger = async () => {
        setLoading(true);
        const data = await getProduits();
        setProduits(data);
        setLoading(false);
    };

    useEffect(() => { charger(); }, []);

    const handleSupprimer = async (id: string) => {
        if (!confirm("Supprimer ce produit ?")) return;
        await deleteProduit(id);
        charger();
    };

    if (vue === 'ajout') return <AjoutProduit onSuccess={() => { setVue('liste'); charger(); }} />;
    if (vue === 'modifier' && produitSelectionne) return <ModifierProduit produit={produitSelectionne} onSuccess={() => { setVue('liste'); charger(); }} />;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gestion des Produits</h1>
                <button onClick={() => setVue('ajout')} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    + Ajouter
                </button>
            </div>

            {loading ? <p>Chargement...</p> : (
                <table className="w-full border-collapse border">
                    <thead>
                        <tr className="bg-gray-100 text-left">
                            <th className="border px-4 py-2">Nom</th>
                            <th className="border px-4 py-2">Catégorie</th>
                            <th className="border px-4 py-2">Prix</th>
                            <th className="border px-4 py-2">Stock</th>
                            <th className="border px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {produits.map((p) => (
                            <tr key={p._id} className="hover:bg-gray-50">
                                <td className="border px-4 py-2">{p.nom}</td>
                                <td className="border px-4 py-2">{p.categorie}</td>
                                <td className="border px-4 py-2">{p.prix} €</td>
                                <td className="border px-4 py-2">{p.stock}</td>
                                <td className="border px-4 py-2 flex gap-2">
                                    <button onClick={() => { setProduitSelectionne(p); setVue('modifier'); }} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                                        Modifier
                                    </button>
                                    <button onClick={() => handleSupprimer(p._id!)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                        Supprimer
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default GestionProduits;