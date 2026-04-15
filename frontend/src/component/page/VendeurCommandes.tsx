import { useState, useEffect } from "react";
import { getVendeurOrders } from "../../api/commande";

const statusLabels: Record<string, string> = {
    en_attente: "En attente",
    confirmee: "Confirmee",
    en_livraison: "En livraison",
    livree: "Livree",
    annulee: "Annulee",
};
const statusColors: Record<string, string> = {
    en_attente: "#f59e0b",
    confirmee: "#2563eb",
    en_livraison: "#8b5cf6",
    livree: "#16a34a",
    annulee: "#ef4444",
};

const VendeurCommandes = () => {
    const [subOrders, setSubOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const charger = async () => {
            setLoading(true);
            try {
                const data = await getVendeurOrders();
                setSubOrders(data);
            } catch { setSubOrders([]); }
            finally { setLoading(false); }
        };
        charger();
    }, []);

    const cardStyle: React.CSSProperties = {
        background: "white", borderRadius: "14px", padding: "20px 24px",
        marginBottom: "14px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f1f5f9", padding: "36px 40px" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1e293b", marginBottom: "24px" }}>
                Mes commandes (Vendeur)
            </h1>

            {loading ? <p>Chargement...</p> : subOrders.length === 0 ? (
                <p style={{ color: "#94a3b8" }}>Aucune commande recue.</p>
            ) : subOrders.map((so: any) => (
                <div key={so.id} style={cardStyle}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                        <div>
                            <span style={{ fontWeight: 700, color: "#1e293b", fontSize: "1rem" }}>
                                Sous-commande #{so.id}
                            </span>
                            <span style={{ marginLeft: "12px", padding: "4px 10px", borderRadius: "9999px", fontSize: "0.78rem", fontWeight: 700, color: "white", background: statusColors[so.statut] || "#94a3b8" }}>
                                {statusLabels[so.statut] || so.statut}
                            </span>
                        </div>
                        <div style={{ fontWeight: 700, color: "#2563eb" }}>
                            {parseFloat(so.sous_total).toFixed(2)} EUR
                        </div>
                    </div>
                    <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                        Commande principale #{so.order_id} | Client #{so.client_id || "?"} |
                        {so.created_at && <span> {new Date(so.created_at).toLocaleDateString("fr-FR")}</span>}
                    </div>
                    {so.items && so.items.length > 0 && (
                        <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid #f1f5f9" }}>
                            {so.items.map((item: any, i: number) => (
                                <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", padding: "4px 0" }}>
                                    <span style={{ color: "#1e293b" }}>{item.produit_nom || "Produit"} x{item.quantite}</span>
                                    <span style={{ color: "#64748b" }}>{parseFloat(item.prix_unitaire).toFixed(2)} EUR/u</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default VendeurCommandes;
