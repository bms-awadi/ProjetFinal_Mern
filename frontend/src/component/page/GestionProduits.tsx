import { useState, useEffect } from "react";
import { Produit } from "../../model/produit";
import { getProduitsVendeur, getProduits, createProduit, updateProduit, deleteProduit, getCategories } from "../../api/produit";
import { getAdherentConnecte } from "../../api/adherent";

const GestionProduits = () => {
    const [produits, setProduits] = useState<Produit[]>([]);
    const [categories, setCategories] = useState<{ id: number; nom: string }[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editProduit, setEditProduit] = useState<Produit | null>(null);
    const [form, setForm] = useState({ nom: "", description: "", prix: "", stock: "", categorie_id: "" });
    const [message, setMessage] = useState("");
    const user = getAdherentConnecte();
    const isAdmin = user?.role === "admin";

    const charger = async () => {
        setLoading(true);
        try {
            const data = isAdmin ? await getProduits() : await getProduitsVendeur();
            setProduits(data);
            const cats = await getCategories();
            setCategories(cats);
        } catch { setProduits([]); }
        finally { setLoading(false); }
    };

    useEffect(() => { charger(); }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                nom: form.nom,
                description: form.description,
                prix: parseFloat(form.prix),
                stock: parseInt(form.stock),
                categorie_id: form.categorie_id ? parseInt(form.categorie_id) : undefined,
            };
            if (editProduit) {
                await updateProduit(editProduit.id!, payload);
                setMessage("Produit mis a jour.");
            } else {
                await createProduit(payload);
                setMessage("Produit cree.");
            }
            setShowForm(false);
            setEditProduit(null);
            setForm({ nom: "", description: "", prix: "", stock: "", categorie_id: "" });
            charger();
        } catch (e: any) {
            setMessage(e?.message || "Erreur");
        }
    };

    const handleEdit = (p: Produit) => {
        setEditProduit(p);
        setForm({
            nom: p.nom,
            description: p.description || "",
            prix: String(p.prix),
            stock: String(p.stock),
            categorie_id: p.categorie_id ? String(p.categorie_id) : "",
        });
        setShowForm(true);
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Supprimer ce produit ?")) return;
        try {
            await deleteProduit(id);
            charger();
        } catch (e: any) {
            setMessage(e?.message || "Erreur");
        }
    };

    const inputStyle: React.CSSProperties = {
        width: "100%", padding: "10px 12px", borderRadius: "8px",
        border: "1px solid #e2e8f0", fontSize: "0.9rem", boxSizing: "border-box",
    };

    return (
        <div style={{ minHeight: "100vh", background: "#f1f5f9", padding: "36px 40px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1e293b" }}>
                    {isAdmin ? "Tous les produits" : "Mes produits"}
                </h1>
                <button onClick={() => { setShowForm(true); setEditProduit(null); setForm({ nom: "", description: "", prix: "", stock: "", categorie_id: "" }); }}
                    style={{ padding: "10px 20px", borderRadius: "10px", border: "none", background: "#2563eb", color: "white", fontWeight: 700, cursor: "pointer" }}>
                    + Nouveau produit
                </button>
            </div>

            {message && (
                <div style={{ marginBottom: "16px", padding: "10px 14px", borderRadius: "8px", background: "rgba(37,99,235,0.1)", color: "#2563eb", fontWeight: 600, fontSize: "0.85rem" }}>
                    {message}
                </div>
            )}

            {showForm && (
                <div style={{ background: "white", borderRadius: "14px", padding: "24px", marginBottom: "24px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
                    <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: "16px" }}>
                        {editProduit ? "Modifier le produit" : "Nouveau produit"}
                    </h2>
                    <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                        <div>
                            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748b" }}>Nom</label>
                            <input value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} style={inputStyle} required />
                        </div>
                        <div>
                            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748b" }}>Categorie</label>
                            <select value={form.categorie_id} onChange={(e) => setForm({ ...form, categorie_id: e.target.value })} style={inputStyle}>
                                <option value="">-- aucune --</option>
                                {categories.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748b" }}>Prix (EUR)</label>
                            <input type="number" step="0.01" min="0" value={form.prix} onChange={(e) => setForm({ ...form, prix: e.target.value })} style={inputStyle} required />
                        </div>
                        <div>
                            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748b" }}>Stock</label>
                            <input type="number" min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} style={inputStyle} required />
                        </div>
                        <div style={{ gridColumn: "1 / -1" }}>
                            <label style={{ fontSize: "0.85rem", fontWeight: 600, color: "#64748b" }}>Description</label>
                            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={inputStyle} />
                        </div>
                        <div style={{ gridColumn: "1 / -1", display: "flex", gap: "10px" }}>
                            <button type="submit" style={{ padding: "10px 24px", borderRadius: "8px", border: "none", background: "#16a34a", color: "white", fontWeight: 700, cursor: "pointer" }}>
                                {editProduit ? "Mettre a jour" : "Creer"}
                            </button>
                            <button type="button" onClick={() => { setShowForm(false); setEditProduit(null); }}
                                style={{ padding: "10px 24px", borderRadius: "8px", border: "1px solid #e2e8f0", background: "white", color: "#64748b", fontWeight: 600, cursor: "pointer" }}>
                                Annuler
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {loading ? <p>Chargement...</p> : (
                <div style={{ background: "white", borderRadius: "14px", overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,0.06)" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                        <thead>
                            <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "0.82rem", color: "#64748b", fontWeight: 600 }}>Nom</th>
                                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "0.82rem", color: "#64748b", fontWeight: 600 }}>Categorie</th>
                                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "0.82rem", color: "#64748b", fontWeight: 600 }}>Prix</th>
                                <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "0.82rem", color: "#64748b", fontWeight: 600 }}>Stock</th>
                                {isAdmin && <th style={{ padding: "12px 16px", textAlign: "left", fontSize: "0.82rem", color: "#64748b", fontWeight: 600 }}>Vendeur</th>}
                                <th style={{ padding: "12px 16px", textAlign: "right", fontSize: "0.82rem", color: "#64748b", fontWeight: 600 }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {produits.map((p) => (
                                <tr key={p.id} style={{ borderBottom: "1px solid #f1f5f9" }}>
                                    <td style={{ padding: "12px 16px", fontWeight: 600, color: "#1e293b" }}>{p.nom}</td>
                                    <td style={{ padding: "12px 16px", color: "#64748b" }}>{p.categorie_nom || "-"}</td>
                                    <td style={{ padding: "12px 16px", color: "#2563eb", fontWeight: 700 }}>{p.prix} EUR</td>
                                    <td style={{ padding: "12px 16px" }}>
                                        <span style={{ color: p.stock > 0 ? "#16a34a" : "#ef4444", fontWeight: 600 }}>{p.stock}</span>
                                    </td>
                                    {isAdmin && <td style={{ padding: "12px 16px", color: "#64748b" }}>{p.vendeur_prenom} {p.vendeur_nom}</td>}
                                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                                        <button onClick={() => handleEdit(p)} style={{ marginRight: "8px", padding: "6px 12px", borderRadius: "6px", border: "1px solid #e2e8f0", background: "white", color: "#2563eb", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem" }}>Modifier</button>
                                        <button onClick={() => handleDelete(p.id!)} style={{ padding: "6px 12px", borderRadius: "6px", border: "none", background: "#fee2e2", color: "#ef4444", cursor: "pointer", fontWeight: 600, fontSize: "0.82rem" }}>Supprimer</button>
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

export default GestionProduits;
