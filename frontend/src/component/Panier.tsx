import { useState, useEffect } from "react";
import { usePanier } from "./ContenuPanier";
import { createCommande, getCommandes } from "../api/commande";
import { updateProduit } from "../api/produit";
import { getAdherentConnecte } from "../api/adherent";

// --- Types ---
interface ProduitPopule {
    _id?: string;
    nom: string;
    categorie: string;
    prix: number;
    stock: number;
}
interface Commande {
    _id?: string;
    adherent: string | object;
    produit: string | ProduitPopule;
    quantite: number;
    date: Date | string;
}

const getProduit = (c: Commande): ProduitPopule | null =>
    typeof c.produit === "object" ? c.produit as ProduitPopule : null;

const fmt = (d: Date | string) =>
    new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" });

const moisLabel = (y: number, m: number) =>
    new Date(y, m).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

// --- Composant ---
const Panier = () => {
    const { panier, supprimerDuPanier, modifierQuantite, viderPanier, total } = usePanier();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [succes, setSucces] = useState(false);

    // Historique
    const [onglet, setOnglet] = useState<'panier' | 'historique'>('panier');
    const [commandes, setCommandes] = useState<Commande[]>([]);
    const [loadingHisto, setLoadingHisto] = useState(false);
    const now = new Date();
    const [moisSel, setMoisSel] = useState(now.getMonth());
    const [anneSel, setAnneSel] = useState(now.getFullYear());

    // 24 derniers mois
    const moisOptions: { y: number; m: number }[] = [];
    for (let i = 0; i < 24; i++) {
        const d = new Date(now.getFullYear(), now.getMonth() - i);
        moisOptions.push({ y: d.getFullYear(), m: d.getMonth() });
    }

    useEffect(() => {
        if (onglet !== 'historique') return;
        const charger = async () => {
            setLoadingHisto(true);
            try {
                const data = await getCommandes();
                setCommandes(data);
            } catch { setCommandes([]); }
            finally { setLoadingHisto(false); }
        };
        charger();
    }, [onglet]);

    const commandesFiltrees = commandes.filter((c) => {
        const d = new Date(c.date);
        return d.getMonth() === moisSel && d.getFullYear() === anneSel;
    });

    const totalMois = commandesFiltrees.reduce((acc, c) => {
        const p = getProduit(c);
        return acc + (p ? p.prix * c.quantite : 0);
    }, 0);

    const validerCommande = async () => {
        if (panier.length === 0) return;
        const stockInsuffisant = panier.find((item) => item.quantite > item.produit.stock);
        if (stockInsuffisant) {
            setSucces(false);
            setMessage(`Stock insuffisant pour : ${stockInsuffisant.produit.nom}`);
            return;
        }

        const adherentConnecte = getAdherentConnecte();
        if (!adherentConnecte?.id) {
            setSucces(false);
            setMessage("Impossible d'identifier l'adhérent connecté.");
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            for (const item of panier) {
                await createCommande({
                    adherent: adherentConnecte.id,
                    produit: item.produit._id,
                    quantite: item.quantite,
                    date: new Date(),
                } as any);

                await updateProduit(item.produit._id!, {
                    ...item.produit,
                    stock: item.produit.stock - item.quantite,
                });
            }
            viderPanier();
            setSucces(true);
            setMessage("Commande validée avec succès !");
        } catch (e: any) {
            setSucces(false);
            setMessage(`Erreur : ${e?.message ?? "Veuillez réessayer."}`);
        } finally {
            setLoading(false);
        }
    };

    const btnRond = (bg: string): React.CSSProperties => ({
        width: "30px", height: "30px", borderRadius: "50%",
        border: "none", background: bg, color: "white",
        fontWeight: 700, fontSize: "1rem", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
    });

    const ongletStyle = (actif: boolean): React.CSSProperties => ({
        padding: "10px 24px", borderRadius: "9999px", border: "none",
        fontWeight: 700, fontSize: "0.9rem", cursor: "pointer",
        background: actif ? "#2563eb" : "white",
        color: actif ? "white" : "#64748b",
        boxShadow: actif ? "0 2px 8px rgba(37,99,235,0.2)" : "none",
        transition: "all 0.2s",
    });

    return (
        <div style={{ minHeight: "100vh", background: "#f1f5f9", padding: "36px 40px" }}>

            {/* Onglets */}
            <div style={{
                display: "flex", gap: "4px", marginBottom: "28px",
                background: "#e2e8f0", borderRadius: "9999px",
                padding: "4px", width: "fit-content",
            }}>
                <button style={ongletStyle(onglet === 'panier')} onClick={() => setOnglet('panier')}>
                    Mon Panier
                    {panier.length > 0 && (
                        <span style={{
                            marginLeft: "8px", background: "#ef4444", color: "white",
                            borderRadius: "9999px", padding: "1px 7px", fontSize: "0.75rem",
                        }}>
                            {panier.length}
                        </span>
                    )}
                </button>
                <button style={ongletStyle(onglet === 'historique')} onClick={() => setOnglet('historique')}>
                    Historique des commandes
                </button>
            </div>

            {/* ===== PANIER ===== */}
            {onglet === 'panier' && (
                <>
                    {message && (
                        <div style={{
                            marginBottom: "20px", padding: "12px 16px", borderRadius: "10px",
                            background: succes ? "rgba(22,163,74,0.1)" : "rgba(239,68,68,0.1)",
                            border: `1px solid ${succes ? "rgba(22,163,74,0.3)" : "rgba(239,68,68,0.3)"}`,
                            color: succes ? "#15803d" : "#dc2626",
                            fontWeight: 600, fontSize: "0.9rem",
                        }}>
                            {message}
                        </div>
                    )}

                    {panier.length === 0 && !message ? (
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "300px" }}>
                            <div style={{ textAlign: "center", color: "#94a3b8" }}>
                                <div style={{ fontSize: "3rem", marginBottom: "12px" }}>🛒</div>
                                <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>Votre panier est vide.</p>
                            </div>
                        </div>
                    ) : (
                        <div style={{ display: "flex", gap: "28px", alignItems: "flex-start" }}>

                            {/* Liste articles */}
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "14px" }}>
                                {panier.map((item) => (
                                    <div key={item.produit._id} style={{
                                        background: "white", borderRadius: "14px",
                                        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                                        padding: "18px 22px", display: "flex", alignItems: "center", gap: "16px",
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontWeight: 700, fontSize: "1rem", color: "#1e293b", marginBottom: "4px" }}>
                                                {item.produit.nom}
                                            </p>
                                            <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                                                {item.produit.categorie} &nbsp;|&nbsp; {item.produit.prix} € / unité
                                            </p>
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <button style={btnRond("#ef4444")}
                                                onClick={() => modifierQuantite(item.produit._id!, item.quantite - 1)}>−</button>
                                            <span style={{ fontWeight: 700, fontSize: "1rem", minWidth: "20px", textAlign: "center", color: "#1e293b" }}>
                                                {item.quantite}
                                            </span>
                                            <button
                                                disabled={item.quantite >= item.produit.stock}
                                                style={btnRond(item.quantite >= item.produit.stock ? "#cbd5e1" : "#2563eb")}
                                                onClick={() => modifierQuantite(item.produit._id!, item.quantite + 1)}>+</button>
                                        </div>
                                        <p style={{ fontWeight: 700, fontSize: "1rem", color: "#2563eb", minWidth: "80px", textAlign: "right" }}>
                                            {(item.produit.prix * item.quantite).toFixed(2)} €
                                        </p>
                                        <button onClick={() => supprimerDuPanier(item.produit._id!)}
                                            style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "1.1rem", padding: "4px" }}>
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Récapitulatif sticky */}
                            <div style={{
                                width: "280px", flexShrink: 0, background: "white",
                                borderRadius: "14px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                                padding: "24px 20px", position: "sticky", top: "24px",
                            }}>
                                <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#1e293b", marginBottom: "16px" }}>
                                    Récapitulatif
                                </h2>
                                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "14px", marginBottom: "20px" }}>
                                    {panier.map((item) => (
                                        <div key={item.produit._id} style={{
                                            display: "flex", justifyContent: "space-between",
                                            fontSize: "0.82rem", color: "#64748b", marginBottom: "8px",
                                        }}>
                                            <span>{item.produit.nom} × {item.quantite}</span>
                                            <span>{(item.produit.prix * item.quantite).toFixed(2)} €</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{
                                    display: "flex", justifyContent: "space-between",
                                    fontWeight: 800, fontSize: "1.05rem", color: "#1e293b",
                                    borderTop: "1px solid #e2e8f0", paddingTop: "14px", marginBottom: "20px",
                                }}>
                                    <span>Total</span>
                                    <span style={{ color: "#2563eb" }}>{total.toFixed(2)} €</span>
                                </div>
                                <button
                                    onClick={validerCommande}
                                    disabled={loading || panier.length === 0}
                                    style={{
                                        width: "100%", padding: "12px", borderRadius: "10px", border: "none",
                                        background: loading ? "#94a3b8" : "#16a34a",
                                        color: "white", fontWeight: 700, fontSize: "0.95rem",
                                        cursor: loading ? "not-allowed" : "pointer", transition: "background 0.2s",
                                    }}>
                                    {loading ? "Validation en cours..." : "Valider la commande"}
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* ===== HISTORIQUE ===== */}
            {onglet === 'historique' && (
                <div>
                    {/* Sélecteur mois */}
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                        <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748b" }}>Période :</label>
                        <select
                            value={`${anneSel}-${moisSel}`}
                            onChange={(e) => {
                                const [y, m] = e.target.value.split("-").map(Number);
                                setAnneSel(y); setMoisSel(m);
                            }}
                            style={{
                                padding: "8px 14px", borderRadius: "8px",
                                border: "1px solid #e2e8f0", background: "white",
                                fontSize: "0.9rem", fontWeight: 600, color: "#1e293b", cursor: "pointer",
                            }}
                        >
                            {moisOptions.map(({ y, m }) => (
                                <option key={`${y}-${m}`} value={`${y}-${m}`}>
                                    {moisLabel(y, m)}
                                </option>
                            ))}
                        </select>
                        <span style={{ fontSize: "0.82rem", color: "#94a3b8" }}>
                            {commandesFiltrees.length} commande{commandesFiltrees.length > 1 ? "s" : ""}
                        </span>
                        {commandesFiltrees.length > 0 && (
                            <span style={{ marginLeft: "auto", fontWeight: 700, color: "#2563eb", fontSize: "0.95rem" }}>
                                Total : {totalMois.toFixed(2)} €
                            </span>
                        )}
                    </div>

                    {loadingHisto ? (
                        <p style={{ color: "#64748b" }}>Chargement...</p>
                    ) : commandesFiltrees.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
                            <div style={{ fontSize: "2.5rem", marginBottom: "12px" }}>📭</div>
                            <p style={{ fontWeight: 600 }}>Aucune commande ce mois-ci.</p>
                        </div>
                    ) : (
                        <div style={{ background: "white", borderRadius: "16px", boxShadow: "0 2px 12px rgba(0,0,0,0.07)", overflow: "hidden" }}>
                            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                                <thead>
                                    <tr style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                                        {["Date", "Produit", "Catégorie", "Qté", "Prix unit.", "Total"].map((h) => (
                                            <th key={h} style={{
                                                padding: "12px 18px", textAlign: "left",
                                                fontSize: "0.78rem", fontWeight: 700,
                                                color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em",
                                            }}>{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {commandesFiltrees.map((c, i) => {
                                        const p = getProduit(c);
                                        return (
                                            <tr key={c._id ?? i} style={{
                                                borderBottom: "1px solid #f1f5f9",
                                                background: i % 2 === 0 ? "white" : "#fafcff",
                                            }}>
                                                <td style={{ padding: "13px 18px", fontSize: "0.85rem", color: "#64748b" }}>{fmt(c.date)}</td>
                                                <td style={{ padding: "13px 18px", fontWeight: 600, color: "#1e293b", fontSize: "0.9rem" }}>{p?.nom ?? "—"}</td>
                                                <td style={{ padding: "13px 18px", fontSize: "0.85rem", color: "#64748b" }}>{p?.categorie ?? "—"}</td>
                                                <td style={{ padding: "13px 18px", fontWeight: 700, color: "#1e293b", textAlign: "center" }}>{c.quantite}</td>
                                                <td style={{ padding: "13px 18px", color: "#2563eb", fontWeight: 600, fontSize: "0.9rem" }}>
                                                    {p ? `${p.prix.toFixed(2)} €` : "—"}
                                                </td>
                                                <td style={{ padding: "13px 18px", fontWeight: 800, color: "#2563eb", fontSize: "0.95rem" }}>
                                                    {p ? `${(p.prix * c.quantite).toFixed(2)} €` : "—"}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Panier;