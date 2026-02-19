import { useState } from "react";
import { usePanier } from "./ContenuPanier";
import { createCommande } from "../api/commande";
import { updateProduit } from "../api/produit";

const Panier = () => {
    const { panier, supprimerDuPanier, modifierQuantite, viderPanier, total } = usePanier();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [succes, setSucces] = useState(false);

    const getAdherentId = (): string => {
        const token = localStorage.getItem("token");
        if (!token) return "";
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.id ?? payload._id ?? "";
        } catch {
            return "";
        }
    };

    const validerCommande = async () => {
        if (panier.length === 0) return;

        const stockInsuffisant = panier.find((item) => item.quantite > item.produit.stock);
        if (stockInsuffisant) {
            setSucces(false);
            setMessage(`Stock insuffisant pour : ${stockInsuffisant.produit.nom}`);
            return;
        }

        setLoading(true);
        setMessage("");

        const adherentId = getAdherentId();

        try {
            await Promise.all(
                panier.map(async (item) => {
                    await createCommande({
                        _id: "",
                        adherent: { _id: adherentId, nom: "", prenom: "", role: "", mdp: "", email: "" },
                        produit: item.produit,
                        quantite: item.quantite,
                        date: new Date().toISOString(),
                    });

                    // _id! : on affirme que _id existe (produit vient toujours de la BDD)
                    // cast en number pour rester compatible avec l'API du collegue
                    await updateProduit(item.produit._id! as unknown as number, {
                        ...item.produit,
                        stock: item.produit.stock - item.quantite,
                    });
                })
            );

            viderPanier();
            setSucces(true);
            setMessage("Commande validee avec succes.");
        } catch (e) {
            setSucces(false);
            setMessage("Une erreur est survenue. Veuillez reessayer.");
        } finally {
            setLoading(false);
        }
    };

    if (panier.length === 0 && !message) {
        return (
            <div className="p-6 max-w-2xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">Mon Panier</h1>
                <p className="text-gray-500">Votre panier est vide.</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Mon Panier</h1>

            {message && (
                <p className={`mb-4 font-semibold ${succes ? "text-green-600" : "text-red-500"}`}>
                    {message}
                </p>
            )}

            <div className="flex flex-col gap-4">
                {panier.map((item) => (
                    <div
                        key={item.produit._id}
                        className="flex items-center justify-between border rounded p-4 shadow-sm"
                    >
                        <div>
                            <p className="font-semibold text-lg">{item.produit.nom}</p>
                            <p className="text-gray-500 text-sm">{item.produit.prix} € / unite</p>
                        </div>

                        <div className="flex items-center gap-2">
                            <button
                                className="bg-red-500 text-white px-2 py-1 rounded"
                                onClick={() => modifierQuantite(item.produit._id!, item.quantite - 1)}
                            >
                                -
                            </button>
                            <span className="font-semibold w-6 text-center">{item.quantite}</span>
                            <button
                                disabled={item.quantite >= item.produit.stock}
                                className={`px-2 py-1 rounded text-white ${item.quantite >= item.produit.stock
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-blue-600 hover:bg-blue-700"
                                    }`}
                                onClick={() => modifierQuantite(item.produit._id!, item.quantite + 1)}
                            >
                                +
                            </button>
                        </div>

                        <p className="font-semibold w-20 text-right">
                            {(item.produit.prix * item.quantite).toFixed(2)} €
                        </p>

                        <button
                            className="text-red-500 hover:underline text-sm ml-4"
                            onClick={() => supprimerDuPanier(item.produit._id!)}
                        >
                            Supprimer
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-6 text-right">
                <p className="text-xl font-bold mb-4">Total : {total.toFixed(2)} €</p>
                <button
                    onClick={validerCommande}
                    disabled={loading || panier.length === 0}
                    className={`px-6 py-3 rounded text-white text-lg font-semibold ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
                        }`}
                >
                    {loading ? "Validation en cours..." : "Valider la commande"}
                </button>
            </div>
        </div>
    );
};

export default Panier;