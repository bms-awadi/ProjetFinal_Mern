import { useState } from "react";
import { Adherent } from "../../model/adherent";

interface FormAdherentProps {
    initialData?: Adherent;
    onSubmit: (adherent: Adherent) => Promise<Adherent>;
    onSuccess?: () => void;
    submitLabel?: string;
}

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "0.9rem",
    outline: "none",
    background: "#f8fafc",
    color: "#1e293b",
    boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
    fontSize: "0.82rem",
    fontWeight: 600,
    color: "#64748b",
    marginBottom: "5px",
    display: "block",
};

const FormAdherent = ({ initialData, onSubmit, onSuccess, submitLabel = "Enregistrer" }: FormAdherentProps) => {
    const [nom, setNom] = useState(initialData?.nom ?? "");
    const [prenom, setPrenom] = useState(initialData?.prenom ?? "");
    const [role, setRole] = useState(initialData?.role ?? "Membre");
    const [mdp, setMdp] = useState("");
    const [email, setEmail] = useState(initialData?.email ?? "");
    const [message, setMessage] = useState("");
    const [succes, setSucces] = useState(false);
    const [loading, setLoading] = useState(false);



    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const adherent: Adherent = { nom, prenom, role, mdp, email };
        if (!nom || !prenom || !role || !email) {
            setSucces(false);
            setMessage("Veuillez remplir tous les champs correctement.");
            return;
        }
        setLoading(true);
        try {
            await onSubmit(adherent);
            setSucces(true);
            setMessage("Enregistré avec succès !");
            onSuccess?.();
        } catch {
            setSucces(false);
            setMessage("Une erreur est survenue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {message && (
                <div style={{
                    padding: "10px 14px", borderRadius: "8px",
                    background: succes ? "rgba(22,163,74,0.1)" : "rgba(239,68,68,0.1)",
                    border: `1px solid ${succes ? "rgba(22,163,74,0.3)" : "rgba(239,68,68,0.3)"}`,
                    color: succes ? "#15803d" : "#dc2626",
                    fontSize: "0.85rem", fontWeight: 600,
                }}>
                    {message}
                </div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                    <label style={labelStyle}>Nom</label>
                    <input style={inputStyle} type="text" placeholder="Nom" value={nom} onChange={(e) => setNom(e.target.value)} required />
                </div>
                <div>
                    <label style={labelStyle}>Prénom</label>
                    <input style={inputStyle} type="text" placeholder="Prénom" value={prenom} onChange={(e) => setPrenom(e.target.value)} required />
                </div>
            </div>

            <div>
                <label style={labelStyle}>Email</label>
                <input style={inputStyle} type="email" placeholder="exemple@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>

            <div>
                <label style={labelStyle}>Mot de passe</label>
                <input style={inputStyle} type="password" placeholder="••••••••" value={mdp} onChange={(e) => setMdp(e.target.value)} required />
            </div>

            <div>
                <label style={labelStyle}>Rôle</label>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    style={{ ...inputStyle, cursor: "pointer" }}
                    required
                >
                    <option value="Adherent">Adherent</option>
                    <option value="Admin">Admin</option>
                </select>
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                    marginTop: "4px",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "none",
                    background: loading ? "#94a3b8" : "#16a34a",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "background 0.2s",
                }}
            >
                {loading ? "Enregistrement..." : submitLabel}
            </button>
        </div>
    );
};

export default FormAdherent;