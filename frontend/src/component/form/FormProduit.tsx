import { useState, useEffect } from "react";
import { Produit } from "../../model/produit";
import { getCategories } from "../../api/produit";

interface FormProduitProps {
    initialData?: Produit;
    onSubmit: (produit: any) => Promise<any>;
    onSuccess?: () => void;
    submitLabel?: string;
}

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #e2e8f0",
    fontSize: "0.9rem",
    outline: "none",
    background: "#f8fafc",
    color: "#1e293b",
    boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
    fontSize: "0.82rem",
    fontWeight: 600,
    color: "#64748b",
    marginBottom: "5px",
    display: "block",
};

const FormProduit = ({ initialData, onSubmit, onSuccess, submitLabel = "Enregistrer" }: FormProduitProps) => {
    const [nom, setNom] = useState(initialData?.nom ?? "");
    const [description, setDescription] = useState(initialData?.description ?? "");
    const [categorie_id, setCategorieId] = useState<string>(initialData?.categorie_id ? String(initialData.categorie_id) : "");
    const [categories, setCategories] = useState<{ id: number; nom: string }[]>([]);
    const [prix, setPrix] = useState<number>(initialData?.prix ?? 0);
    const [stock, setStock] = useState<number>(initialData?.stock ?? 0);
    const [message, setMessage] = useState("");
    const [succes, setSucces] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getCategories().then(setCategories).catch(() => { });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nom || prix < 0 || stock < 0) {
            setSucces(false);
            setMessage("Veuillez remplir tous les champs correctement.");
            return;
        }
        setLoading(true);
        try {
            await onSubmit({
                nom,
                description,
                prix,
                stock,
                categorie_id: categorie_id ? parseInt(categorie_id) : undefined,
            });
            setSucces(true);
            setMessage("Enregistre avec succes !");
            onSuccess?.();
        } catch {
            setSucces(false);
            setMessage("Une erreur est survenue.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {message && (
                <div style={{
                    padding: "10px 14px", borderRadius: "8px",
                    background: succes ? "rgba(22,163,74,0.1)" : "rgba(239,68,68,0.1)",
                    border: `1px solid ${succes ? "rgba(22,163,74,0.3)" : "rgba(239,68,68,0.3)"}`,
                    color: succes ? "#15803d" : "#dc2626",
                    fontSize: "0.85rem", fontWeight: 600,
                }}>
                    {message}
                </div>
            )}

            <div>
                <label style={labelStyle}>Nom du produit</label>
                <input style={inputStyle} type="text" placeholder="Ex : Ballon de foot" value={nom} onChange={(e) => setNom(e.target.value)} required />
            </div>

            <div>
                <label style={labelStyle}>Categorie</label>
                <select value={categorie_id} onChange={(e) => setCategorieId(e.target.value)} style={{ ...inputStyle, cursor: "pointer" }}>
                    <option value="">-- aucune --</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.nom}</option>)}
                </select>
            </div>

            <div>
                <label style={labelStyle}>Description</label>
                <input style={inputStyle} type="text" placeholder="Description du produit" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                <div>
                    <label style={labelStyle}>Prix (€)</label>
                    <input style={inputStyle} type="number" placeholder="0.00" value={prix}
                        onChange={(e) => setPrix(Number(e.target.value))} min={0} step={0.01} required />
                </div>
                <div>
                    <label style={labelStyle}>Stock</label>
                    <input style={inputStyle} type="number" placeholder="0" value={stock}
                        onChange={(e) => setStock(Number(e.target.value))} min={0} required />
                </div>
            </div>

            <button
                onClick={handleSubmit}
                disabled={loading}
                style={{
                    marginTop: "4px",
                    padding: "12px",
                    borderRadius: "10px",
                    border: "none",
                    background: loading ? "#94a3b8" : "#16a34a",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.95rem",
                    cursor: loading ? "not-allowed" : "pointer",
                    transition: "background 0.2s",
                }}
            >
                {loading ? "Enregistrement..." : submitLabel}
            </button>
        </div>
    );
};

export default FormProduit;