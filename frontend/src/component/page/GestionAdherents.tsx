import { useState, useEffect } from "react";
import { User } from "../../model/adherent";
import { getAdherents, deleteAdherent, updateAdherent } from "../../api/adherent";

const roleColors: Record<string, string> = {
    client: "#2563eb",
    vendeur: "#16a34a",
    livreur: "#f59e0b",
    admin: "#ef4444",
};

const GestionAdherents = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterRole, setFilterRole] = useState("all");

    const charger = async () => {
        setLoading(true);
        try {
            const data = await getAdherents();
            setUsers(data);
        } catch { setUsers([]); }
        finally { setLoading(false); }
    };

    useEffect(() => { charger(); }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Supprimer cet utilisateur ?")) return;
        try {
            await deleteAdherent(id);
            charger();
        } catch {}
    };

    const handleRoleChange = async (id: number, newRole: string) => {
        try {
            await updateAdherent(id, { role: newRole });
            charger();
        } catch {}
    };

    const filtered = filterRole === "all" ? users : users.filter((u) => u.role === filterRole);

    return (
        <div style={{ minHeight: "100vh", background: "#f1f5f9", padding: "36px 40px" }}>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1e293b", marginBottom: "24px" }}>
                Gestion des utilisateurs
            </h1>

            <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
                {["all", "client", "vendeur", "livreur", "admin"].map((r) => (
                    <button key={r} onClick={() => setFilterRole(r)} style={{
                        padding: "8px 16px", borderRadius: "9999px", border: "none",
                        fontWeight: 600, fontSize: "0.85rem", cursor: "pointer",
                        background: filterRole === r ? "#2563eb" : "#e2e8f0",
                        color: filterRole === r ? "white" : "#475569",
                    }}>{r === "all" ? "Tous" : r.charAt(0).toUpperCase() + r.slice(1)}</button>
                ))}
                <span style={{ marginLeft: "auto", color: "#94a3b8", fontSize: "0.85rem", alignSelf: "center" }}>
                    {filtered.length} utilisateur(s)
                </span>
            </div>

            {loading ? <p>Chargement...</p> : (
                <div style={{ background: "white", borderRadius: "14px", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "0.82rem", color: "#64748b", fontWeight: 600 }}>ID</th>
                                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "0.82rem", color: "#64748b", fontWeight: 600 }}>Nom</th>
                                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "0.82rem", color: "#64748b", fontWeight: 600 }}>Email</th>
                                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "0.82rem", color: "#64748b", fontWeight: 600 }}>Role</th>
                                <th style={{ padding: "12px 16px", textAlign: "right", fontSize: "0.82rem", color: "#64748b", fontWeight: 600 }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((u) => (
                                <tr key={u.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                    <td style={{ padding: "12px 16px", color: "#94a3b8" }}>#{u.id}</td>
                                    <td style={{ padding: "12px 16px", fontWeight: 600, color: "#1e293b" }}>{u.prenom} {u.nom}</td>
                                    <td style={{ padding: "12px 16px", color: "#64748b" }}>{u.email}</td>
                                    <td style={{ padding: "12px 16px" }}>
                                        <select value={u.role} onChange={(e) => handleRoleChange(u.id!, e.target.value)}
                                            style={{ padding: "4px 8px", borderRadius: "6px", border: "1px solid #e2e8f0", fontWeight: 600, color: roleColors[u.role] || "#333", cursor: "pointer" }}>
                                            <option value="client">Client</option>
                                            <option value="vendeur">Vendeur</option>
                                            <option value="livreur">Livreur</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                                        <button onClick={() => handleDelete(u.id!)}
                                            style={{ padding: "6px 12px", borderRadius: "6px", border: "none", background: "#fee2e2", color: "#ef4444", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem" }}>
                                            Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default GestionAdherents;
