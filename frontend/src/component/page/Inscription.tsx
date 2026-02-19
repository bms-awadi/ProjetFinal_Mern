import { useState } from "react";
import { createAdherent } from "../../api/adherent";

interface Props {
    onSwitchConnexion: () => void;  // pour basculer vers le formulaire de connexion
}

const Inscription = ({ onSwitchConnexion }: Props) => {
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [email, setEmail] = useState("");
    const [mdp, setMdp] = useState("");
    const [message, setMessage] = useState("");
    const [succes, setSucces] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nom || !prenom || !email || !mdp) {
            setMessage("Veuillez remplir tous les champs.");
            setSucces(false);
            return;
        }

        setLoading(true);
        setMessage("");
        try {
            await createAdherent({ nom, prenom, email, mdp, role: 'adherent' });
            setSucces(true);
            setMessage("Compte cree avec succes. Vous pouvez maintenant vous connecter.");
        } catch {
            setSucces(false);
            setMessage("Erreur lors de l inscription. Email deja utilise ?");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 p-6 border rounded shadow">
            <h2 className="text-2xl font-bold mb-6">Inscription</h2>

            {message && (
                <p className={`mb-4 font-semibold ${succes ? "text-green-600" : "text-red-500"}`}>
                    {message}
                </p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                    type="text"
                    placeholder="Nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                    className="border px-3 py-2 rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Prenom"
                    value={prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    className="border px-3 py-2 rounded"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border px-3 py-2 rounded"
                    required
                />
                <input
                    type="password"
                    placeholder="Mot de passe"
                    value={mdp}
                    onChange={(e) => setMdp(e.target.value)}
                    className="border px-3 py-2 rounded"
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    className={`py-2 px-4 rounded text-white font-semibold ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                >
                    {loading ? "Inscription en cours..." : "S inscrire"}
                </button>
            </form>

            <p className="mt-4 text-sm text-gray-600">
                Deja un compte ?{" "}
                <button
                    onClick={onSwitchConnexion}
                    className="text-blue-600 hover:underline"
                >
                    Se connecter
                </button>
            </p>
        </div>
    );
};

export default Inscription;