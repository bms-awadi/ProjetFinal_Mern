import { createProduit } from "../../api/produit";
import FormProduit from "../form/FormProduit";

const AjoutProduit = ({ onSuccess }: { onSuccess?: () => void }) => (
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
                Ajouter un produit
            </h1>
        </div>

        {/* Formulaire */}
        <div style={{
            background: "white", borderRadius: "16px",
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            padding: "28px", maxWidth: "560px",
        }}>
            <h2 style={{
                fontSize: "1rem", fontWeight: 700, color: "#1e293b",
                marginBottom: "20px", borderBottom: "1px solid #f1f5f9", paddingBottom: "12px",
            }}>
                Informations du produit
            </h2>
            <FormProduit
                onSubmit={createProduit}
                onSuccess={onSuccess}
                submitLabel="Ajouter le produit"
            />
        </div>
    </div>
);

export default AjoutProduit;