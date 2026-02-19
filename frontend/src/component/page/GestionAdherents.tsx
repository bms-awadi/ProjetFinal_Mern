import { useEffect, useState } from "react";
import { Adherent } from "../../model/adherent";
import { getAdherents, deleteAdherent } from "../../api/adherent";
import AjoutAdherent from "./AjoutAdherent";
import ModifierAdherent from "./ModifierAdherent";

const GestionAdherents = () => {
    const [adherents, setAdherents] = useState<Adherent[]>([]);
    const [loading, setLoading] = useState(true);
    const [vue, setVue] = useState<'liste' | 'ajout' | 'modifier'>('liste');
    const [adherentSelectionne, setAdherentSelectionne] = useState<Adherent | null>(null);

    const charger = async () => {
        setLoading(true);
        const data = await getAdherents();
        setAdherents(data);
        setLoading(false);
    };

    useEffect(() => { charger(); }, []);

    const handleSupprimer = async (id: string) => {
        if (!confirm("Supprimer cet adhérent ?")) return;
        await deleteAdherent(id);
        charger();
    };

    if (vue === 'ajout') return <AjoutAdherent onSuccess={() => { setVue('liste'); charger(); }} />;
    if (vue === 'modifier' && adherentSelectionne) return <ModifierAdherent adherent={adherentSelectionne} onSuccess={() => { setVue('liste'); charger(); }} />;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Gestion des Adhérents</h1>
                <button onClick={() => setVue('ajout')} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
                    + Ajouter
                </button>
            </div>

            {loading ? <p>Chargement...</p> : (
                <table className="w-full border-collapse border">
                    <tr className="bg-gray-100 text-left">
                        <th className="border px-4 py-2">Nom</th>
                        <th className="border px-4 py-2">Prénom</th>
                        <th className="border px-4 py-2">Email</th>
                        <th className="border px-4 py-2">Rôle</th>
                        <th className="border px-4 py-2">Actions</th>
                    </tr>
                    {adherents.map((a) => (
                        <tr key={a._id} className="hover:bg-gray-50">
                            <td className="border px-4 py-2">{a.nom}</td>
                            <td className="border px-4 py-2">{a.prenom}</td>
                            <td className="border px-4 py-2">{a.email}</td>
                            <td className="border px-4 py-2">{a.role}</td>
                            <td className="border px-4 py-2 flex gap-2">
                                <button onClick={() => { setAdherentSelectionne(a); setVue('modifier'); }} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                                    Modifier
                                </button>
                                <button onClick={() => handleSupprimer(a._id!)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                </table>
            )}
        </div>
    );
};

export default GestionAdherents;