import { useState, useEffect } from "react";
import { Delivery } from "../../model/delivery";
import { getAvailableDeliveries, getMyDeliveries, assignDelivery, updateDeliveryStatus } from "../../api/delivery";

const statusLabels: Record<string, string> = {
    en_attente: "En attente",
    prise_en_charge: "Prise en charge",
    en_cours: "En cours",
    livree: "Livree",
};
const statusColors: Record<string, string> = {
    en_attente: "#f59e0b",
    prise_en_charge: "#2563eb",
    en_cours: "#8b5cf6",
    livree: "#16a34a",
};
const nextStatus: Record<string, string> = {
    prise_en_charge: "en_cours",
    en_cours: "livree",
};

const LivreurDashboard = () => {
    const [available, setAvailable] = useState<Delivery[]>([]);
    const [mine, setMine] = useState<Delivery[]>([]);
    const [tab, setTab] = useState<"available" | "mine">("mine");
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    const charger = async () => {
        setLoading(true);
        try {
            const [a, m] = await Promise.all([getAvailableDeliveries(), getMyDeliveries()]);
            setAvailable(a);
            setMine(m);
        } catch { }
        finally { setLoading(false); }
    };

    useEffect(() => { charger(); }, []);

    const handleAssign = async (deliveryId: number) => {
        try {
            await assignDelivery(deliveryId);
            setMessage("Livraison assignee.");
            charger();
        } catch (e: any) {
            setMessage(e?.message || "Erreur lors de l'assignation.");
        }
    };

    const handleStatus = async (deliveryId: number, status: string) => {
        try {
            await updateDeliveryStatus(deliveryId, status);
            setMessage("Statut mis a jour.");
            charger();
        } catch (e: any) {
            setMessage(e?.message || "Erreur.");
        }
    };

    const badgeStyle = (status: string): React.CSSProperties => ({
        display: "inline-block", padding: "4px 10px", borderRadius: "9999px",
        fontSize: "0.78rem", fontWeight: 700, color: "white",
        background: statusColors[status] || "#94a3b8",
    });

    const cardStyle: React.CSSProperties = {
        background: "white", borderRadius: "14px", padding: "18px 20px",
        marginBottom: "14px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
        display: "flex", justifyContent: "space-between", alignItems: "center",
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f1f5f9", padding: "36px 40px" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1e293b", marginBottom: "24px" }}>
                Espace Livreur
            </h1>

            {message && (
                <div style={{ marginBottom: "16px", padding: "10px 14px", borderRadius: "8px", background: "rgba(37,99,235,0.1)", color: "#2563eb", fontWeight: 600, fontSize: "0.85rem" }}>
                    {message}
                </div>
            )}

            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                <button onClick={() => setTab("mine")} style={{
                    padding: "10px 20px", borderRadius: "9999px", border: "none",
                    fontWeight: 700, cursor: "pointer",
                    background: tab === "mine" ? "#2563eb" : "#e2e8f0",
                    color: tab === "mine" ? "white" : "#475569",
                }}>Mes livraisons ({mine.length})</button>
                <button onClick={() => setTab("available")} style={{
                    padding: "10px 20px", borderRadius: "9999px", border: "none",
                    fontWeight: 700, cursor: "pointer",
                    background: tab === "available" ? "#2563eb" : "#e2e8f0",
                    color: tab === "available" ? "white" : "#475569",
                }}>Disponibles ({available.length})</button>
            </div>

            {loading ? <p>Chargement...</p> : tab === "available" ? (
                available.length === 0 ? <p style={{ color: "#94a3b8" }}>Aucune livraison disponible.</p> :
                available.map((d) => (
                    <div key={d.id} style={cardStyle}>
                        <div>
                            <div style={{ fontWeight: 700, color: "#1e293b" }}>Livraison #{d.id}</div>
                            <div style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "4px" }}>
                                Sous-commande #{d.sub_order_id} - {d.adresse_livraison || "Adresse non renseignee"}
                            </div>
                        </div>
                        <button onClick={() => handleAssign(d.id!)}
                            style={{ padding: "8px 18px", borderRadius: "8px", border: "none", background: "#2563eb", color: "white", fontWeight: 700, cursor: "pointer" }}>
                            Prendre en charge
                        </button>
                    </div>
                ))
            ) : (
                mine.length === 0 ? <p style={{ color: "#94a3b8" }}>Aucune livraison en cours.</p> :
                mine.map((d) => (
                    <div key={d.id} style={cardStyle}>
                        <div>
                            <div style={{ fontWeight: 700, color: "#1e293b" }}>
                                Livraison #{d.id} <span style={badgeStyle(d.statut)}>{statusLabels[d.statut] || d.statut}</span>
                            </div>
                            <div style={{ fontSize: "0.85rem", color: "#64748b", marginTop: "4px" }}>
                                Sous-commande #{d.sub_order_id} - {d.adresse_livraison || "Adresse non renseignee"}
                            </div>
                        </div>
                        {nextStatus[d.statut] && (
                            <button onClick={() => handleStatus(d.id!, nextStatus[d.statut])}
                                style={{ padding: "8px 18px", borderRadius: "8px", border: "none", background: "#16a34a", color: "white", fontWeight: 700, cursor: "pointer" }}>
                                {nextStatus[d.statut] === "en_cours" ? "Demarrer" : "Marquer livree"}
                            </button>
                        )}
                    </div>
                ))
            )}
        </div>
    );
};

export default LivreurDashboard;
