import { useState } from "react";
import { Adherent } from "../model/adherent";

interface FormAdherentProps {
    initialData?: Adherent;
    onSubmit: (produit: Adherent) => Promise<Adherent>;
    submitLabel?: string;
}

const FormAdherent = ({ initialData, onSubmit, submitLabel = "Enregistrer" }: FormAdherentProps) => {
    const [nom, setNom] = useState(initialData?.nom ?? "");
    const [prenom, setPrenom] = useState(initialData?.prenom ?? "");
    const [role, setRole] = useState(initialData?.role ?? "Membre");
    const [mdp, setMdp] = useState(initialData?.mdp ?? "");
    const [email, setEmail] = useState(initialData?.email ?? "");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let adherent: Adherent = { nom, prenom, role, mdp, email };
        if (adherent.nom == "" || adherent.prenom == "" || adherent.role == "" || adherent.mdp == "" || adherent.email == "") {
            setMessage("Veuillez remplir tous les champs correctement.");
            return;
        }

        try {
            await onSubmit(adherent);
            setMessage("Succès !");
        } catch {
            setMessage("Une erreur est survenue.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {message && <p className="text-blue-700">{message}</p>}
            <input type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} className="border px-3 py-2 rounded" required />
            <input type="text" placeholder="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} className="border px-3 py-2 rounded" required />
            <select value={role} onChange={(e) => setRole(e.target.value)} className="border px-3 py-2 rounded" required>
                <option value="Membre">Membre</option>
                <option value="Admin">Admin</option>
            </select>
            <input type="password" placeholder="Mot de passe" value={mdp} onChange={(e) => setMdp(e.target.value)} className="border px-3 py-2 rounded" required />
            <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="border px-3 py-2 rounded" required />
            <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700">{submitLabel}</button>
        </form>
    );
};

export default FormAdherent;