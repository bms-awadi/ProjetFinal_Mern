import { useState } from "react";
import { connexion } from "../../api/adherent";

interface Props {
    onConnecte: () => void;
    onSwitchInscription: () => void;
}

const Connexion = ({ onConnecte, onSwitchInscription }: Props) => {
    const [email, setEmail] = useState("");
    const [mdp, setMdp] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !mdp) {
            setMessage("Veuillez remplir tous les champs.");
            return;
        }

        setLoading(true);
        setMessage("");
        try {
            await connexion(email, mdp);
            onConnecte();
        } catch {
            setMessage("Email ou mot de passe incorrect.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-12 p-6 border rounded shadow">
            <h2 className="text-2xl font-bold mb-6">Connexion</h2>

            {message && (
                <p className="mb-4 font-semibold text-red-500">{message}</p>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                    {loading ? "Connexion en cours..." : "Se connecter"}
                </button>
            </form>

            <p className="mt-4 text-sm text-gray-600">
                Pas encore de compte ?{" "}
                <button
                    onClick={onSwitchInscription}
                    className="text-blue-600 hover:underline"
                >
                    S inscrire
                </button>
            </p>
        </div>
    );
};

export default Connexion;