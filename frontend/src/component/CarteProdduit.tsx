import { Produit } from "../model/produit";
import { usePanier } from "./ContenuPanier";

interface Props {
    produit: Produit;
}

// Composant isolé pour une seule carte produit
// Séparé du Catalogue pour que le code reste lisible
const CarteProduit = ({ produit }: Props) => {
    const { panier, ajouterAuPanier, modifierQuantite } = usePanier();

    const itemPanier = panier.find((p) => p.produit._id === produit._id);
    const quantitePanier = itemPanier ? itemPanier.quantite : 0;

    // Stock restant = stock réel − ce qui est déjà dans le panier
    const stockRestant = produit.stock - quantitePanier;
    const epuise = stockRestant <= 0;

    return (
        <div className="border p-4 rounded shadow hover:shadow-lg transition flex flex-col justify-between">
            <div>
                <h2 className="text-xl font-semibold mb-2">{produit.nom}</h2>
                <p className="text-gray-600 mb-1">Catégorie : {produit.categorie}</p>
                <p className="text-gray-600 mb-1">
                    Stock disponible :{" "}
                    <span className={epuise ? "text-red-500 font-bold" : ""}>
                        {stockRestant}
                    </span>
                </p>
                <p className="text-gray-600 mb-2">Prix : {produit.prix} €</p>
            </div>

            <div className="flex flex-col gap-2 mt-2">
                {quantitePanier === 0 ? (
                    <button
                        disabled={epuise}
                        onClick={() => ajouterAuPanier(produit, 1)}
                        className={`px-3 py-1 rounded text-white ${epuise
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-green-600 hover:bg-green-700"
                            }`}
                    >
                        {epuise ? "Stock épuisé" : "Ajouter au panier"}
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        <button
                            className="bg-red-500 text-white px-2 py-1 rounded"
                            onClick={() => modifierQuantite(produit._id!, quantitePanier - 1)}
                        >
                        </button>
                        <span className="font-semibold">{quantitePanier}</span>
                        <button
                            disabled={epuise}
                            className={`px-2 py-1 rounded text-white ${epuise ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                                }`}
                            onClick={() => modifierQuantite(produit._id!, quantitePanier + 1)}
                        >
                            +
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CarteProduit;