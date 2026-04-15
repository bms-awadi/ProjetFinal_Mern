import { useState, useEffect } from "react";
import { getAdherents, getUsersByRole } from "../../api/adherent";
import { getAllOrders, getOrderStats } from "../../api/commande";
import { getAllDeliveries } from "../../api/delivery";

interface Stats {
    total_orders: number;
    total_revenue: number;
    total_commission: number;
}

const AdminDashboard = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [userCounts, setUserCounts] = useState({ clients: 0, vendeurs: 0, livreurs: 0, admins: 0 });
    const [recentOrders, setRecentOrders] = useState<any[]>([]);
    const [deliveries, setDeliveries] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const charger = async () => {
            setLoading(true);
            try {
                const [s, users, orders, dels] = await Promise.all([
                    getOrderStats(),
                    getAdherents(),
                    getAllOrders(),
                    getAllDeliveries(),
                ]);
                setStats(s);
                setUserCounts({
                    clients: users.filter((u: any) => u.role === "client").length,
                    vendeurs: users.filter((u: any) => u.role === "vendeur").length,
                    livreurs: users.filter((u: any) => u.role === "livreur").length,
                    admins: users.filter((u: any) => u.role === "admin").length,
                });
                setRecentOrders(orders.slice(0, 10));
                setDeliveries(dels.slice(0, 10));
            } catch { }
            finally { setLoading(false); }
        };
        charger();
    }, []);

    const cardStyle: React.CSSProperties = {
        background: "white", borderRadius: "14px", padding: "24px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.06)", flex: 1,
    };
    const statNum: React.CSSProperties = { fontSize: "2rem", fontWeight: 800, color: "#1e293b" };
    const statLabel: React.CSSProperties = { fontSize: "0.85rem", color: "#64748b", marginTop: "4px" };
    const statusColors: Record<string, string> = {
        en_attente: "#f59e0b", confirmee: "#2563eb", en_livraison: "#8b5cf6", livree: "#16a34a", annulee: "#ef4444",
    };

    if (loading) return <div style={{ padding: "40px" }}>Chargement...</div>;

    return (
        <div style={{ minHeight: "100vh", background: "#f1f5f9", padding: "36px 40px" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1e293b", marginBottom: "24px" }}>
                Tableau de bord Administrateur
            </h1>

            {/* Stats cards */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
                <div style={cardStyle}>
                    <div style={statNum}>{stats?.total_orders ?? 0}</div>
                    <div style={statLabel}>Commandes totales</div>
                </div>
                <div style={cardStyle}>
                    <div style={{ ...statNum, color: "#2563eb" }}>{(stats?.total_revenue ?? 0).toFixed(2)} EUR</div>
                    <div style={statLabel}>Chiffre d'affaires</div>
                </div>
                <div style={cardStyle}>
                    <div style={{ ...statNum, color: "#16a34a" }}>{(stats?.total_commission ?? 0).toFixed(2)} EUR</div>
                    <div style={statLabel}>Commissions</div>
                </div>
            </div>

            {/* User counts */}
            <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
                {[
                    { label: "Clients", count: userCounts.clients, color: "#2563eb" },
                    { label: "Vendeurs", count: userCounts.vendeurs, color: "#16a34a" },
                    { label: "Livreurs", count: userCounts.livreurs, color: "#f59e0b" },
                    { label: "Admins", count: userCounts.admins, color: "#ef4444" },
                ].map((item) => (
                    <div key={item.label} style={cardStyle}>
                        <div style={{ ...statNum, color: item.color }}>{item.count}</div>
                        <div style={statLabel}>{item.label}</div>
                    </div>
                ))}
            </div>

            {/* Recent orders */}
            <div style={{ background: "white", borderRadius: "14px", padding: "24px", marginBottom: "24px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "14px" }}>Commandes recentes</h2>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                            <th style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.82rem", color: "#64748b" }}>ID</th>
                            <th style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.82rem", color: "#64748b" }}>Client</th>
                            <th style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.82rem", color: "#64748b" }}>Total</th>
                            <th style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.82rem", color: "#64748b" }}>Commission</th>
                            <th style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.82rem", color: "#64748b" }}>Statut</th>
                            <th style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.82rem", color: "#64748b" }}>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {recentOrders.map((o: any) => (
                            <tr key={o.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                <td style={{ padding: "10px 14px" }}>#{o.id}</td>
                                <td style={{ padding: "10px 14px", fontWeight: 600 }}>{o.client_prenom || ""} {o.client_nom || ""}</td>
                                <td style={{ padding: "10px 14px", color: "#2563eb", fontWeight: 700 }}>{parseFloat(o.total).toFixed(2)} EUR</td>
                                <td style={{ padding: "10px 14px", color: "#16a34a", fontWeight: 600 }}>{parseFloat(o.commission).toFixed(2)} EUR</td>
                                <td style={{ padding: "10px 14px" }}>
                                    <span style={{
                                        padding: "4px 10px", borderRadius: "9999px", fontSize: "0.78rem",
                                        fontWeight: 700, color: "white", background: statusColors[o.statut] || "#94a3b8",
                                    }}>{o.statut}</span>
                                </td>
                                <td style={{ padding: "10px 14px", color: "#94a3b8", fontSize: "0.85rem" }}>
                                    {new Date(o.created_at).toLocaleDateString("fr-FR")}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Recent deliveries */}
            <div style={{ background: "white", borderRadius: "14px", padding: "24px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "14px" }}>Livraisons recentes</h2>
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <thead>
                        <tr style={{ borderBottom: "1px solid #e2e8f0" }}>
                            <th style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.82rem", color: "#64748b" }}>ID</th>
                            <th style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.82rem", color: "#64748b" }}>Sous-commande</th>
                            <th style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.82rem", color: "#64748b" }}>Livreur</th>
                            <th style={{ padding: "10px 14px", textAlign: "left", fontSize: "0.82rem", color: "#64748b" }}>Statut</th>
                        </tr>
                    </thead>
                    <tbody>
                        {deliveries.map((d: any) => (
                            <tr key={d.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                <td style={{ padding: "10px 14px" }}>#{d.id}</td>
                                <td style={{ padding: "10px 14px" }}>#{d.sub_order_id}</td>
                                <td style={{ padding: "10px 14px", fontWeight: 600 }}>
                                    {d.livreur_prenom ? d.livreur_prenom + " " + d.livreur_nom : "Non assigne"}
                                </td>
                                <td style={{ padding: "10px 14px" }}>
                                    <span style={{
                                        padding: "4px 10px", borderRadius: "9999px", fontSize: "0.78rem",
                                        fontWeight: 700, color: "white", background: statusColors[d.statut] || "#94a3b8",
                                    }}>{d.statut}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminDashboard;
