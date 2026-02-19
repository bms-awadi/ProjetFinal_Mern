import { useState } from "react";
import { Produit } from "../model/produit";

interface FormProduitProps {
    initialData?: Produit;
    onSubmit: (produit: Produit) => Promise<Produit>;
    submitLabel?: string;
}

const FormProduit = ({ initialData, onSubmit, submitLabel = "Enregistrer" }: FormProduitProps) => {
    const [nom, setNom] = useState(initialData?.nom ?? "");
    const [categorie, setCategorie] = useState(initialData?.categorie ?? "Football");
    const [prix, setPrix] = useState<number>(initialData?.prix ?? 0);
    const [stock, setStock] = useState<number>(initialData?.stock ?? 0);
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let produit: Produit = { nom, categorie, prix, stock };
        if (produit.nom === "" || produit.categorie == "" || produit.prix < 0 || produit.stock < 0) {
            setMessage("Veuillez remplir tous les champs correctement.");
            return;
        }

        try {
            await onSubmit(produit);
            setMessage("Succès !");
        } catch {
            setMessage("Une erreur est survenue.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {message && <p className="text-blue-700">{message}</p>}
            <input type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} className="border px-3 py-2 rounded" required />
            <select value={categorie} onChange={(e) => setCategorie(e.target.value)} className="border px-3 py-2 rounded">
                <option value="Football">Football</option>
                <option value="Natation">Natation</option>
                <option value="Basketball">Basketball</option>
            </select>
            <input type="number" placeholder="Prix (€)" value={prix} onChange={(e) => setPrix(Number(e.target.value))} className="border px-3 py-2 rounded" min={0} step={0.01} required />
            <input type="number" placeholder="Stock" value={stock} onChange={(e) => setStock(Number(e.target.value))} className="border px-3 py-2 rounded" min={0} required />
            <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">{submitLabel}</button>
        </form>
    );
};

export default FormProduit;