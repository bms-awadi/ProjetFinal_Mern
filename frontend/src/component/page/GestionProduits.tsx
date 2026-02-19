import { useEffect, useState } from "react";
import { Produit } from "../../model/produit";
import { getProduits, deleteProduit } from "../../api/produit";
import AjoutProduit from "./AjoutProduit";
import ModifierProduit from "./ModifierProduit";

const GestionProduits = () => {
    const [produits, setProduits] = useState<Produit[]>([]);
    const [loading, setLoading] = useState(true);
    const [vue, setVue] = useState<'liste' | 'ajout' | 'modifier'>('liste');
    const [produitSelectionne, setProduitSelectionne] = useState<Produit | null>(null);
    const [confirmId, setConfirmId] = useState<string | null>(null);

    const charger = async () => {
        setLoading(true);
        const data = await getProduits();
        setProduits(data);
        setLoading(false);
    };

    useEffect(() => { charger(); }, []);

    const handleSupprimer = async () => {
        if (!confirmId) return;
        await deleteProduit(confirmId);
        setConfirmId(null);
        charger();
    };

    if (vue === 'ajout') return <AjoutProduit onSuccess={() => { setVue('liste'); charger(); }} />;
    if (vue === 'modifier' && produitSelectionne) return <ModifierProduit produit={produitSelectionne} onSuccess={() => { setVue('liste'); charger(); }} />;

    const categorieBadge = (cat: string): React.CSSProperties => {
        const colors: Record<string, { bg: string; color: string; border: string }> = {
            Football: { bg: "rgba(234,179,8,0.1)", color: "#a16207", border: "rgba(234,179,8,0.3)" },
            Natation: { bg: "rgba(6,182,212,0.1)", color: "#0e7490", border: "rgba(6,182,212,0.3)" },
            Basketball: { bg: "rgba(249,115,22,0.1)", color: "#c2410c", border: "rgba(249,115,22,0.3)" },
        };
        const c = colors[cat] ?? { bg: "rgba(100,116,139,0.1)", color: "#475569", border: "rgba(100,116,139,0.3)" };
        return {
            display: "inline-block", padding: "3px 10px", borderRadius: "9999px",
            fontSize: "0.75rem", fontWeight: 700,
            background: c.bg, color: c.color, border: `1px solid ${c.border}`,
        };
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f1f5f9", padding: "36px 40px" }}>

            {/* Modale de confirmation */}
            {confirmId && (
                <div style={{
                    position: "fixed", inset: 0, zIndex: 100,
                    background: "rgba(0,0,0,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                    <div style={{
                        background: "white", borderRadius: "16px",
                        boxShadow: "0 8px 40px rgba(0,0,0,0.2)",
                        padding: "32px 28px", width: "100%", maxWidth: "380px",
                        textAlign: "center",
                    }}>
                        <div style={{
                            width: "52px", height: "52px", borderRadius: "50%",
                            background: "rgba(239,68,68,0.1)", margin: "0 auto 16px",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "1.5rem",
                        }}>
                            🗑️
                        </div>
                        <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1e293b", marginBottom: "8px" }}>
                            Supprimer ce produit ?
                        </h3>
                        <p style={{ fontSize: "0.85rem", color: "#94a3b8", marginBottom: "24px" }}>
                            Cette action est irréversible.
                        </p>
                        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                            <button
                                onClick={() => setConfirmId(null)}
                                style={{
                                    padding: "10px 24px", borderRadius: "8px",
                                    border: "1px solid #e2e8f0", background: "white",
                                    color: "#64748b", fontWeight: 600, fontSize: "0.9rem", cursor: "pointer",
                                }}
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleSupprimer}
                                style={{
                                    padding: "10px 24px", borderRadius: "8px", border: "none",
                                    background: "#ef4444", color: "white",
                                    fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
                                }}
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* En-tête */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#1e293b" }}>
                    Gestion des Produits
                </h1>
                <button
                    onClick={() => setVue('ajout')}
                    style={{
                        padding: "10px 22px", borderRadius: "10px", border: "none",
                        background: "#16a34a", color: "white", fontWeight: 700,
                        fontSize: "0.9rem", cursor: "pointer",
                    }}
                >
                    + Ajouter
                </button>
            </div>

            {loading ? (
                <p style={{ color: "#64748b" }}>Chargement...</p>
            ) : (
                <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                                {["Nom", "Catégorie", "Prix", "Stock", "Actions"].map((h) => (
                                    <th key={h} style={{
                                        padding: "14px 20px", textAlign: "left",
                                        fontSize: "0.8rem", fontWeight: 700,
                                        color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em",
                                    }}>
                                        {h}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {produits.map((p, i) => (
                                <tr key={p._id} style={{
                                    borderBottom: "1px solid #f1f5f9",
                                    background: i % 2 === 0 ? "white" : "#fafcff",
                                }}>
                                    <td style={{ padding: "14px 20px", fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>
                                        {p.nom}
                                    </td>
                                    <td style={{ padding: "14px 20px" }}>
                                        <span style={categorieBadge(p.categorie)}>{p.categorie}</span>
                                    </td>
                                    <td style={{ padding: "14px 20px", fontWeight: 700, color: "#2563eb", fontSize: "0.9rem" }}>
                                        {p.prix.toFixed(2)} €
                                    </td>
                                    <td style={{ padding: "14px 20px" }}>
                                        <span style={{
                                            fontWeight: 700, fontSize: "0.9rem",
                                            color: p.stock === 0 ? "#ef4444" : p.stock < 5 ? "#f97316" : "#16a34a",
                                        }}>
                                            {p.stock}
                                        </span>
                                    </td>
                                    <td style={{ padding: "14px 20px" }}>
                                        <div style={{ display: "flex", gap: "8px" }}>
                                            <button
                                                onClick={() => { setProduitSelectionne(p); setVue('modifier'); }}
                                                style={{
                                                    padding: "6px 14px", borderRadius: "8px", border: "none",
                                                    background: "rgba(37,99,235,0.1)", color: "#2563eb",
                                                    fontWeight: 600, fontSize: "0.82rem", cursor: "pointer",
                                                }}
                                            >
                                                Modifier
                                            </button>
                                            <button
                                                onClick={() => setConfirmId(p._id!)}
                                                style={{
                                                    padding: "6px 14px", borderRadius: "8px", border: "none",
                                                    background: "rgba(239,68,68,0.1)", color: "#ef4444",
                                                    fontWeight: 600, fontSize: "0.82rem", cursor: "pointer",
                                                }}
                                            >
                                                Supprimer
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {produits.length === 0 && (
                        <p style={{ textAlign: "center", padding: "32px", color: "#94a3b8" }}>
                            Aucun produit trouvé.
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default GestionProduits;