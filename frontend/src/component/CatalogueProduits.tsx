import { useEffect, useState } from "react";
import { Produit } from "../model/produit";
import { usePanier } from "./ContenuPanier";
import { getProduits } from "../api/produit";
/*import dotenv from "dotenv";
dotenv.config();*/


export const Catalogue = () => {
    const [produits, setProduits] = useState<Produit[]>([]);
    const [categorie, setCategorie] = useState<string>("Tous");
    const [loading, setLoading] = useState<boolean>(true);

    const { panier, ajouterAuPanier, modifierQuantite, total } = usePanier();
    // Charger les produits depuis le backend
    useEffect(() => {
        const fetchProduits = async () => {
            try {
                const data = await getProduits();
                setProduits(data);
            } catch (error) {
                console.error("Erreur lors du chargement des produits:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduits();
    }, []);

    // Filtrer les produits
    const produitsFiltres =
        categorie === "Tous"
            ? produits
            : produits.filter((p) => p.categorie === categorie);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Catalogue Produits</h1>

            {/* Filtre par catégorie */}
            <div className="mb-6 flex gap-4">
                {["Tous", "Football", "Natation"].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setCategorie(cat)}
                        className={`px-4 py-2 rounded ${categorie === cat
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                            }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Total panier */}
            <div className="mb-4 text-right font-semibold text-lg">
                Total Panier: {total.toFixed(2)} €
            </div>

            {loading ? (
                <p>Chargement des produits...</p>
            ) : produitsFiltres.length === 0 ? (
                <p>Aucun produit trouvé.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {produitsFiltres.map((produit) => {
                        const itemPanier = panier.find((p) => p.produit._id === produit._id);
                        const quantitePanier = itemPanier ? itemPanier.quantite : 0;

                        return (
                            <div
                                key={produit._id}
                                className="border p-4 rounded shadow hover:shadow-lg transition flex flex-col justify-between"
                            >
                                <div>
                                    <h2 className="text-xl font-semibold mb-2">{produit.nom}</h2>
                                    <p className="text-gray-600 mb-1">Catégorie: {produit.categorie}</p>
                                    <p className="text-gray-600 mb-1">Stock: {produit.stock}</p>
                                    <p className="text-gray-600 mb-2">Prix: {produit.prix} €</p>
                                </div>

                                {/* Actions panier */}
                                <div className="flex flex-col gap-2">
                                    {quantitePanier === 0 ? (
                                        <button
                                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                                            onClick={() => ajouterAuPanier(produit, 1)}
                                        >
                                            Ajouter au panier
                                        </button>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <button
                                                className="bg-red-500 text-white px-2 py-1 rounded"
                                                onClick={() => modifierQuantite(produit._id!, quantitePanier - 1)}
                                            >
                                                -
                                            </button>
                                            <span>{quantitePanier}</span>
                                            <button
                                                className="bg-blue-600 text-white px-2 py-1 rounded"
                                                onClick={() => modifierQuantite(produit._id!, quantitePanier + 1)}
                                            >
                                                +
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default Catalogue;
