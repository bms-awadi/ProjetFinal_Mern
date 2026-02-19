import { useState } from "react";
import { Produit } from "../model/produit";
import { createProduit } from "../api/produit";

const AjoutProduit = () => {
    const [nom, setNom] = useState("");
    const [categorie, setCategorie] = useState("Football");
    const [prix, setPrix] = useState<number>(0);
    const [stock, setStock] = useState<number>(0);
    const [message, setMessage] = useState<string>("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Vérification simple
        if (!nom || !categorie || prix <= 0 || stock < 0) {
            setMessage("Veuillez remplir tous les champs correctement.");
            return;
        }

        const produit: Produit = {
            nom,
            categorie,
            prix,
            stock,
        };

        try {
            const data = await createProduit(produit); // Utilisation de la fonction API centralisée
            setMessage(`Produit créé avec succès : ${data.nom}`);

            // Réinitialiser le formulaire
            setNom("");
            setCategorie("Football");
            setPrix(0);
            setStock(0);
        } catch (error) {
            console.error("Erreur lors de la création du produit :", error);
            setMessage("Erreur lors de la création du produit. Vérifiez la console.");
        }
    };

    return (
        <div className="max-w-md mx-auto mt-8 p-6 border rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Ajouter un produit</h2>

            {message && <p className="mb-4 text-blue-700">{message}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Nom du produit"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="border px-3 py-2 rounded"
                    required
                />

                <select
                    value={categorie}
                    onChange={(e) => setCategorie(e.target.value)}
                    className="border px-3 py-2 rounded"
                >
                    <option value="Football">Football</option>
                    <option value="Natation">Natation</option>
                    <option value="Basketball">Basketball</option>
                </select>

                <input
                    type="number"
                    placeholder="Prix (€)"
                    value={prix}
                    onChange={(e) => setPrix(Number(e.target.value))}
                    className="border px-3 py-2 rounded"
                    min={0}
                    step={0.01}
                    required
                />

                <input
                    type="number"
                    placeholder="Stock"
                    value={stock}
                    onChange={(e) => setStock(Number(e.target.value))}
                    className="border px-3 py-2 rounded"
                    min={0}
                    required
                />

                <button
                    type="submit"
                    className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
                >
                    Ajouter
                </button>
            </form>
        </div>
    );
};

export default AjoutProduit;
