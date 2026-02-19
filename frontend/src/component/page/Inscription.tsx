import { useState } from "react";
import { createAdherent } from "../../api/adherent";

interface Props {
    onClose: () => void;
}

const Inscription = ({ onClose }: Props) => {
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
            setSucces(false);
            setMessage("Veuillez remplir tous les champs.");
            return;
        }
        setLoading(true);
        setMessage("");
        try {
            await createAdherent({ nom, prenom, email, mdp, role: "adherent" });
            setSucces(true);
            setMessage("Compte cree avec succes. Vous pouvez vous connecter.");
        } catch {
            setSucces(false);
            setMessage("Erreur lors de l inscription. Email deja utilise ?");
        } finally {
            setLoading(false);
        }
    };

    const inputStyle: React.CSSProperties = {
        width: "100%", padding: "10px 14px", borderRadius: "6px",
        border: "1px solid #cbd5e1", fontSize: "0.9rem", outline: "none",
        boxSizing: "border-box", background: "rgba(255,255,255,0.9)",
        color: "#000",
    };

    const labelStyle: React.CSSProperties = {
        color: "rgba(255,255,255,0.85)", fontSize: "0.85rem", fontWeight: 600, marginBottom: "6px", display: "block",
    };

    return (
        <div
            onClick={onClose}
            style={{
                position: "fixed", inset: 0, zIndex: 50,
                background: "rgba(0,0,0,0.6)",
                display: "flex", alignItems: "center", justifyContent: "center",
            }}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "1px solid rgba(255,255,255,0.3)",
                    borderRadius: "20px",
                    padding: "44px 40px",
                    width: "100%", maxWidth: "460px",
                    boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
                    position: "relative",
                }}
            >
                {/* Bouton fermeture */}
                <button
                    onClick={onClose}
                    style={{
                        position: "absolute", top: "16px", right: "20px",
                        background: "none", border: "none", fontSize: "1.5rem",
                        color: "rgba(255,255,255,0.7)", cursor: "pointer", lineHeight: 1,
                    }}
                >
                    ×
                </button>

                <div style={{ marginBottom: "28px" }}>
                    <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "white", margin: 0 }}>Inscription</h2>
                    <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.85rem", marginTop: "4px" }}>
                        Rejoignez la Ligue Sportive
                    </p>
                </div>

                {message && (
                    <div style={{
                        marginBottom: "16px", padding: "10px 14px", borderRadius: "8px", fontSize: "0.85rem",
                        background: succes ? "rgba(34,197,94,0.15)" : "rgba(239,68,68,0.15)",
                        border: `1px solid ${succes ? "rgba(34,197,94,0.4)" : "rgba(239,68,68,0.4)"}`,
                        color: succes ? "#86efac" : "#fca5a5",
                    }}>
                        {message}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div style={{ display: "flex", gap: "14px" }}>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Nom</label>
                            <input type="text" placeholder="Dupont" value={nom} onChange={(e) => setNom(e.target.value)} style={inputStyle} required />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={labelStyle}>Prenom</label>
                            <input type="text" placeholder="Jean" value={prenom} onChange={(e) => setPrenom(e.target.value)} style={inputStyle} required />
                        </div>
                    </div>
                    <div>
                        <label style={labelStyle}>Email</label>
                        <input type="email" placeholder="exemple@email.com" value={email} onChange={(e) => setEmail(e.target.value)} style={inputStyle} required />
                    </div>
                    <div>
                        <label style={labelStyle}>Mot de passe</label>
                        <input type="password" placeholder="••••••••" value={mdp} onChange={(e) => setMdp(e.target.value)} style={inputStyle} required />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            marginTop: "6px", padding: "12px", borderRadius: "8px", border: "none",
                            background: loading ? "#94a3b8" : "#2563eb",
                            color: "white", fontWeight: 700, fontSize: "0.95rem",
                            cursor: loading ? "not-allowed" : "pointer",
                        }}
                    >
                        {loading ? "Inscription en cours..." : "S inscrire"}
                    </button>
                </form>

                {succes && (
                    <p style={{ textAlign: "center", marginTop: "20px", fontSize: "0.875rem" }}>
                        <button
                            onClick={onClose}
                            style={{ background: "none", border: "none", color: "white", fontWeight: 600, cursor: "pointer", textDecoration: "underline" }}
                        >
                            Retour a la connexion
                        </button>
                    </p>
                )}
            </div>
        </div>
    );
};

export default Inscription;