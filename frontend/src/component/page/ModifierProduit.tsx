import { updateProduit } from "../../api/produit";
import FormProduit from "../../component/form/FormProduit";
import { Produit } from "../../model/produit";

const categorieBadge = (cat: string): React.CSSProperties => {
    const colors: Record<string, { bg: string; color: string; border: string }> = {
        Football: { bg: "rgba(234,179,8,0.1)", color: "#a16207", border: "rgba(234,179,8,0.3)" },
        Natation: { bg: "rgba(6,182,212,0.1)", color: "#0e7490", border: "rgba(6,182,212,0.3)" },
        Basketball: { bg: "rgba(249,115,22,0.1)", color: "#c2410c", border: "rgba(249,115,22,0.3)" },
    };
    const c = colors[cat] ?? { bg: "rgba(100,116,139,0.1)", color: "#475569", border: "rgba(100,116,139,0.3)" };
    return {
        display: "inline-block", padding: "4px 12px", borderRadius: "9999px",
        fontSize: "0.75rem", fontWeight: 700,
        background: c.bg, color: c.color, border: `1px solid ${c.border}`,
    };
};

const ModifierProduit = ({ produit, onSuccess }: { produit: Produit; onSuccess?: () => void }) => (
    <div style={{ minHeight: "100vh", background: "#f1f5f9", padding: "36px 40px" }}>

        {/* En-tête */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
            <button
                onClick={() => onSuccess?.()}
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
                Modifier un produit
            </h1>
        </div>

        {/* Carte aperçu produit */}
        <div style={{
            background: "white", borderRadius: "16px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            padding: "20px 24px", marginBottom: "24px",
            display: "flex", alignItems: "center", gap: "18px",
        }}>
            {/* Icône produit */}
            <div style={{
                width: "52px", height: "52px", borderRadius: "12px",
                background: "linear-gradient(135deg, #2563eb, #60a5fa)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontWeight: 800, fontSize: "1.3rem", flexShrink: 0,
            }}>
                {produit.nom?.[0]?.toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 700, fontSize: "1rem", color: "#1e293b", marginBottom: "4px" }}>
                    {produit.nom}
                </p>
                <span style={categorieBadge(produit.categorie)}>{produit.categorie}</span>
            </div>
            <div style={{ display: "flex", gap: "24px", textAlign: "center" }}>
                <div>
                    <p style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600, marginBottom: "2px" }}>PRIX</p>
                    <p style={{ fontSize: "1.05rem", fontWeight: 800, color: "#2563eb" }}>{produit.prix.toFixed(2)} €</p>
                </div>
                <div>
                    <p style={{ fontSize: "0.75rem", color: "#94a3b8", fontWeight: 600, marginBottom: "2px" }}>STOCK</p>
                    <p style={{
                        fontSize: "1.05rem", fontWeight: 800,
                        color: produit.stock === 0 ? "#ef4444" : produit.stock < 5 ? "#f97316" : "#16a34a",
                    }}>
                        {produit.stock}
                    </p>
                </div>
            </div>
        </div>

        {/* Formulaire */}
        <div style={{
            background: "white", borderRadius: "16px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            padding: "28px",
        }}>
            <h2 style={{
                fontSize: "1rem", fontWeight: 700, color: "#1e293b",
                marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px",
            }}>
                Informations à modifier
            </h2>
            <FormProduit
                initialData={produit}
                onSubmit={(data) => updateProduit(produit._id!, data)}
                onSuccess={onSuccess}
                submitLabel="Enregistrer les modifications"
            />
        </div>
    </div>
);

export default ModifierProduit;