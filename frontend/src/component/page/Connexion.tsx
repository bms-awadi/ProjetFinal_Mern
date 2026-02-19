import { useState } from "react";
import { connexion } from "../../api/adherent";
import Inscription from "./Inscription";

interface Props {
    onConnecte: () => void;
}

const Connexion = ({ onConnecte }: Props) => {
    const [email, setEmail] = useState("");
    const [mdp, setMdp] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [showInscription, setShowInscription] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !mdp) { setMessage("Veuillez remplir tous les champs."); return; }
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

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "10px 14px",
        borderRadius: "6px",
        border: "1px solid #cbd5e1",
        fontSize: "0.9rem",
        outline: "none",
        boxSizing: "border-box",
        background: "rgba(255,255,255,0.85)",
        color: "#111",
    };

    return (
        <>
            {/* Fond image + overlay */}
            <div style={{
                minHeight: "100vh",
                backgroundImage: "url('/src/assets/fond1.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
            }}>
                {/* Overlay sombre sur le fond */}
                <div style={{
                    position: "absolute", inset: 0,
                    background: "rgba(0,0,0,0.45)",
                }} />

                {/* Logo en haut à gauche */}
                <div style={{
                    position: "absolute", top: "24px", left: "32px",
                    display: "flex", alignItems: "center", gap: "10px", zIndex: 50,
                }}>
                    {/* Placeholder logo — remplacer par <img src="..." /> */}
                    <img src="/src/assets/logo.png" style={{ width: "200px", height: "200px", borderRadius: "50%", objectFit: "cover" }} />
                    <span style={{ color: "white", fontWeight: 750, fontSize: "1.5rem", letterSpacing: "0.05em" }}>
                        Ligue Sportive
                    </span>
                </div>

                {/* Carte de connexion */}
                <div style={{
                    position: "relative", zIndex: 10,
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(14px)",
                    WebkitBackdropFilter: "blur(14px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "20px",
                    padding: "48px 44px",
                    width: "100%",
                    maxWidth: "420px",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.3)",
                }}>
                    {/* Titre */}

                    {message && (
                        <div style={{
                            marginBottom: "16px", padding: "10px 14px", borderRadius: "8px",
                            background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.4)",
                            color: "#fca5a5", fontSize: "0.85rem",
                        }}>
                            {message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.85rem", fontWeight: 600 }}>
                                Email
                            </label>
                            <input
                                type="email"
                                placeholder="exemple@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={inputStyle}
                                required
                            />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                            <label style={{ color: "rgba(255,255,255,0.85)", fontSize: "0.85rem", fontWeight: 600 }}>
                                Mot de passe
                            </label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={mdp}
                                onChange={(e) => setMdp(e.target.value)}
                                style={inputStyle}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                marginTop: "8px",
                                padding: "12px",
                                borderRadius: "8px",
                                border: "none",
                                background: loading ? "#94a3b8" : "#2563eb",
                                color: "white",
                                fontWeight: 700,
                                fontSize: "0.95rem",
                                cursor: loading ? "not-allowed" : "pointer",
                                transition: "background 0.2s",
                            }}
                        >
                            {loading ? "Connexion en cours..." : "Se connecter"}
                        </button>
                    </form>

                    <div style={{
                        marginTop: "24px", paddingTop: "20px",
                        borderTop: "1px solid rgba(255,255,255,0.2)",
                        textAlign: "center",
                    }}>
                        <span style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.875rem" }}>
                            Pas encore de compte ?{" "}
                        </span>
                        <button
                            onClick={() => setShowInscription(true)}
                            style={{
                                background: "none", border: "none",
                                color: "white", fontWeight: 700,
                                fontSize: "0.875rem", cursor: "pointer",
                                textDecoration: "underline",
                            }}
                        >
                            S inscrire
                        </button>
                    </div>
                </div>
            </div>

            {showInscription && <Inscription onClose={() => setShowInscription(false)} />}
        </>
    );
};

export default Connexion;