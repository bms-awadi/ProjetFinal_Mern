import { updateAdherent } from "../../api/adherent";
import FormAdherent from "../../component/form/FormAdherent";
import { Adherent } from "../../model/adherent";

const ModifierAdherent = ({ adherent, onSuccess }: { adherent: Adherent; onSuccess?: () => void }) => (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", padding: "36px 40px" }}>

        {/* En-tête */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
            <button
                onClick={onSuccess}
                style={{
                    padding: "8px 16px", borderRadius: "8px", border: "none",
                    background: "white", color: "#64748b", fontWeight: 600,
                    fontSize: "0.85rem", cursor: "pointer",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
                }}
            >
                ← Retour
            </button>
            <h1 style={{ fontSize: "1.8rem", fontWeight: 800, color: "#1e293b" }}>
                Modifier un adhérent
            </h1>
        </div>

        {/* Carte identité (lecture seule) */}
        <div style={{
            background: "white", borderRadius: "16px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            padding: "20px 24px", marginBottom: "24px",
            display: "flex", alignItems: "center", gap: "18px",
        }}>
            {/* Avatar initiales */}
            <div style={{
                width: "52px", height: "52px", borderRadius: "50%",
                background: "linear-gradient(135deg, #2563eb, #60a5fa)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontWeight: 800, fontSize: "1.1rem", flexShrink: 0,
            }}>
                {adherent.prenom?.[0]?.toUpperCase()}{adherent.nom?.[0]?.toUpperCase()}
            </div>
            <div>
                <p style={{ fontWeight: 700, fontSize: "1rem", color: "#1e293b" }}>
                    {adherent.prenom} {adherent.nom}
                </p>
                <p style={{ fontSize: "0.82rem", color: "#94a3b8", marginTop: "2px" }}>
                    {adherent.email}
                </p>
            </div>
            <div style={{ marginLeft: "auto" }}>
                <span style={{
                    display: "inline-block", padding: "4px 12px", borderRadius: "9999px",
                    fontSize: "0.75rem", fontWeight: 700,
                    background: adherent.role === "Admin" ? "rgba(37,99,235,0.1)" : "rgba(22,163,74,0.1)",
                    color: adherent.role === "Admin" ? "#2563eb" : "#16a34a",
                    border: `1px solid ${adherent.role === "Admin" ? "rgba(37,99,235,0.3)" : "rgba(22,163,74,0.3)"}`,
                }}>
                    {adherent.role}
                </span>
            </div>
        </div>

        {/* Formulaire */}
        <div style={{
            background: "white", borderRadius: "16px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            padding: "28px 28px",
        }}>
            <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#1e293b", marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px" }}>
                Informations à modifier
            </h2>
            <FormAdherent
                initialData={adherent}
                onSubmit={(data) => updateAdherent(adherent._id!, data)}
                onSuccess={onSuccess}
                submitLabel="Enregistrer les modifications"
            />
        </div>
    </div>
);

export default ModifierAdherent;