import { useState, useEffect } from "react";
import { usePanier } from "./ContenuPanier";
import { createOrder, payOrder, getMyOrders } from "../api/commande";
import { getAdherentConnecte } from "../api/adherent";
import { Order } from "../model/commande";

const statusColors: Record<string, string> = {
    en_attente: "#f59e0b",
    payee: "#2563eb",
    expediee: "#8b5cf6",
    livree: "#16a34a",
    annulee: "#ef4444",
};

const statusLabels: Record<string, string> = {
    en_attente: "En attente",
    payee: "Payee",
    expediee: "Expediee",
    livree: "Livree",
    annulee: "Annulee",
};

const Panier = () => {
    const { panier, supprimerDuPanier, modifierQuantite, viderPanier, total } = usePanier();
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [succes, setSucces] = useState(false);
    const [adresse, setAdresse] = useState("");

    const [onglet, setOnglet] = useState<"panier" | "historique">("panier");
    const [commandes, setCommandes] = useState<Order[]>([]);
    const [loadingHisto, setLoadingHisto] = useState(false);

    useEffect(() => {
        if (onglet !== "historique") return;
        const load = async () => {
            setLoadingHisto(true);
            try {
                const data = await getMyOrders();
                setCommandes(data);
            } catch {
                setCommandes([]);
            } finally {
                setLoadingHisto(false);
            }
        };
        load();
    }, [onglet]);

    const validerCommande = async () => {
        if (panier.length === 0) return;
        const adherent = getAdherentConnecte();
        if (!adherent?.id) {
            setSucces(false);
            setMessage("Vous devez etre connecte.");
            return;
        }
        if (!adresse.trim()) {
            setSucces(false);
            setMessage("Veuillez saisir une adresse de livraison.");
            return;
        }

        setLoading(true);
        setMessage("");
        try {
            const items = panier.map((item) => ({
                product_id: item.produit.id!,
                quantite: item.quantite,
            }));
            const order = await createOrder(items, adresse);
            // Auto-pay (simulation)
            await payOrder(order.id!);
            viderPanier();
            setSucces(true);
            setMessage("Commande validee et paiement accepte !");
        } catch (e: any) {
            setSucces(false);
            setMessage(e?.message ?? "Erreur lors de la commande.");
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
            <div style={{
                display: "flex", gap: "4px", marginBottom: "28px",
                background: "#e2e8f0", borderRadius: "9999px",
                padding: "4px", width: "fit-content",
            }}>
                <button style={ongletStyle(onglet === "panier")} onClick={() => setOnglet("panier")}>
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
                <button style={ongletStyle(onglet === "historique")} onClick={() => setOnglet("historique")}>
                    Mes commandes
                </button>
            </div>

            {onglet === "panier" && (
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
                                <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>Votre panier est vide.</p>
                            </div>
                        </div>
                    ) : panier.length > 0 && (
                        <div style={{ display: "flex", gap: "28px", alignItems: "flex-start" }}>
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "14px" }}>
                                {panier.map((item) => (
                                    <div key={item.produit.id} style={{
                                        background: "white", borderRadius: "14px",
                                        boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                                        padding: "18px 22px", display: "flex", alignItems: "center", gap: "16px",
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontWeight: 700, fontSize: "1rem", color: "#1e293b", marginBottom: "4px" }}>
                                                {item.produit.nom}
                                            </p>
                                            <p style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                                                {item.produit.categorie_nom || ""} | {item.produit.prix} EUR / unite
                                            </p>
                                            {item.produit.vendeur_nom && (
                                                <p style={{ fontSize: "0.75rem", color: "#64748b" }}>
                                                    Vendeur: {item.produit.vendeur_prenom} {item.produit.vendeur_nom}
                                                </p>
                                            )}
                                        </div>
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <button style={btnRond("#ef4444")}
                                                onClick={() => modifierQuantite(String(item.produit.id!), item.quantite - 1)}>-</button>
                                            <span style={{ fontWeight: 700, fontSize: "1rem", minWidth: "20px", textAlign: "center", color: "#1e293b" }}>
                                                {item.quantite}
                                            </span>
                                            <button
                                                disabled={item.quantite >= item.produit.stock}
                                                style={btnRond(item.quantite >= item.produit.stock ? "#cbd5e1" : "#2563eb")}
                                                onClick={() => modifierQuantite(String(item.produit.id!), item.quantite + 1)}>+</button>
                                        </div>
                                        <p style={{ fontWeight: 700, fontSize: "1rem", color: "#2563eb", minWidth: "80px", textAlign: "right" }}>
                                            {(item.produit.prix * item.quantite).toFixed(2)} EUR
                                        </p>
                                        <button onClick={() => supprimerDuPanier(String(item.produit.id!))}
                                            style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "1.1rem", padding: "4px" }}>
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div style={{
                                width: "300px", flexShrink: 0, background: "white",
                                borderRadius: "14px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                                padding: "24px 20px", position: "sticky", top: "24px",
                            }}>
                                <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#1e293b", marginBottom: "16px" }}>
                                    Recapitulatif
                                </h2>
                                <div style={{ borderTop: "1px solid #f1f5f9", paddingTop: "14px", marginBottom: "12px" }}>
                                    {panier.map((item) => (
                                        <div key={item.produit.id} style={{
                                            display: "flex", justifyContent: "space-between",
                                            fontSize: "0.82rem", color: "#64748b", marginBottom: "8px",
                                        }}>
                                            <span>{item.produit.nom} x {item.quantite}</span>
                                            <span>{(item.produit.prix * item.quantite).toFixed(2)} EUR</span>
                                        </div>
                                    ))}
                                </div>
                                <div style={{
                                    display: "flex", justifyContent: "space-between",
                                    fontWeight: 800, fontSize: "1.05rem", color: "#1e293b",
                                    borderTop: "1px solid #e2e8f0", paddingTop: "14px", marginBottom: "16px",
                                }}>
                                    <span>Total</span>
                                    <span style={{ color: "#2563eb" }}>{total.toFixed(2)} EUR</span>
                                </div>

                                <div style={{ marginBottom: "16px" }}>
                                    <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748b", display: "block", marginBottom: "6px" }}>
                                        Adresse de livraison
                                    </label>
                                    <input
                                        type="text"
                                        value={adresse}
                                        onChange={(e) => setAdresse(e.target.value)}
                                        placeholder="123 Rue de la Livraison, Paris"
                                        style={{
                                            width: "100%", padding: "10px 12px", borderRadius: "8px",
                                            border: "1px solid #e2e8f0", fontSize: "0.85rem",
                                            boxSizing: "border-box",
                                        }}
                                    />
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
                                    {loading ? "Validation..." : "Commander et payer"}
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {onglet === "historique" && (
                <div>
                    {loadingHisto ? (
                        <p style={{ color: "#64748b" }}>Chargement...</p>
                    ) : commandes.length === 0 ? (
                        <p style={{ color: "#94a3b8", textAlign: "center", marginTop: "40px" }}>Aucune commande.</p>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                            {commandes.map((cmd) => (
                                <div key={cmd.id} style={{
                                    background: "white", borderRadius: "14px",
                                    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
                                    padding: "20px 24px",
                                }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                                        <div>
                                            <span style={{ fontWeight: 700, color: "#1e293b", fontSize: "1rem" }}>
                                                Commande #{cmd.id}
                                            </span>
                                            <span style={{ marginLeft: "12px", fontSize: "0.82rem", color: "#94a3b8" }}>
                                                {cmd.created_at ? new Date(cmd.created_at).toLocaleDateString("fr-FR") : ""}
                                            </span>
                                        </div>
                                        <span style={{
                                            padding: "4px 12px", borderRadius: "9999px", fontSize: "0.75rem", fontWeight: 700,
                                            background: `${statusColors[cmd.statut || "en_attente"]}20`,
                                            color: statusColors[cmd.statut || "en_attente"],
                                        }}>
                                            {statusLabels[cmd.statut || "en_attente"]}
                                        </span>
                                    </div>
                                    {cmd.sub_orders?.map((so) => (
                                        <div key={so.id} style={{
                                            borderTop: "1px solid #f1f5f9", paddingTop: "10px", marginTop: "8px",
                                        }}>
                                            <p style={{ fontSize: "0.82rem", color: "#64748b", marginBottom: "6px" }}>
                                                Vendeur: {so.vendeur_prenom} {so.vendeur_nom} -
                                                <span style={{ color: statusColors[so.statut || "en_attente"], fontWeight: 600, marginLeft: "6px" }}>
                                                    {statusLabels[so.statut || "en_attente"]}
                                                </span>
                                            </p>
                                            {so.items?.map((item) => (
                                                <div key={item.id} style={{
                                                    display: "flex", justifyContent: "space-between",
                                                    fontSize: "0.82rem", color: "#475569", marginLeft: "12px",
                                                }}>
                                                    <span>{item.product_nom} x {item.quantite}</span>
                                                    <span>{Number(item.sous_total).toFixed(2)} EUR</span>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                    <div style={{
                                        display: "flex", justifyContent: "flex-end",
                                        fontWeight: 800, fontSize: "1rem", color: "#2563eb",
                                        marginTop: "12px", paddingTop: "10px", borderTop: "1px solid #e2e8f0",
                                    }}>
                                        Total: {Number(cmd.total).toFixed(2)} EUR
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Panier;
