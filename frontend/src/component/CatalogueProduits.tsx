import { useEffect, useState } from "react";
import { Produit } from "../model/produit";
import { usePanier } from "./ContenuPanier";
import { getProduits } from "../api/produit";

export const Catalogue = () => {
    const [produits, setProduits] = useState<Produit[]>([]);
    const [categorie, setCategorie] = useState<string>("Tous");
    const [loading, setLoading] = useState<boolean>(true);

    const { panier, ajouterAuPanier, modifierQuantite, total } = usePanier();

    useEffect(() => {
        const fetchProduits = async () => {
            try {
                const data = await getProduits();
                setProduits(data);
            } catch (error) {
                console.error("Erreur lors du chargement des produits:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProduits();
    }, []);

    const produitsFiltres =
        categorie === "Tous"
            ? produits
            : produits.filter((p) => p.categorie === categorie);

    const totalPanier = total;

    return (
        <div style={{ minHeight: "100vh", background: "#f1f5f9" }}>
            {/* Bandeau résumé panier */}
            <div style={{
                background: "white",
                borderBottom: "1px solid #e2e8f0",
                padding: "10px 32px",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                gap: "12px",
            }}>
                <span style={{ fontSize: "0.9rem", color: "#64748b" }}>
                    {panier.length === 0
                        ? "Panier vide"
                        : <><strong style={{ color: "#1d4ed8" }}>{totalPanier.toFixed(2)} €</strong> dans votre panier</>
                    }
                </span>
            </div>

            <div style={{ maxWidth: "100%", margin: "0 auto", padding: "28px 40px" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "#1e293b", marginBottom: "24px" }}>
                    Catalogue Produits
                </h1>
                {/* Filtres */}
                <div style={{ display: "flex", gap: "10px", marginBottom: "28px" }}>
                    {["Tous", "Football", "Natation", "Tennis", "Fitness", "Cyclisme", "Running", "Autres"].map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setCategorie(cat)}
                            style={{
                                padding: "8px 20px",
                                borderRadius: "9999px",
                                border: "none",
                                fontWeight: 600,
                                fontSize: "0.875rem",
                                cursor: "pointer",
                                background: categorie === cat ? "#2563eb" : "#e2e8f0",
                                color: categorie === cat ? "white" : "#475569",
                                transition: "background 0.2s",
                            }}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {loading ? (
                    <p style={{ color: "#64748b" }}>Chargement des produits...</p>
                ) : produitsFiltres.length === 0 ? (
                    <p style={{ color: "#64748b" }}>Aucun produit trouvé.</p>
                ) : (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "20px",
                    }}>
                        {produitsFiltres.map((produit) => {
                            const itemPanier = panier.find((p) => p.produit._id === produit._id);
                            const quantitePanier = itemPanier ? itemPanier.quantite : 0;

                            return (
                                <div
                                    key={produit._id}
                                    style={{
                                        background: "white",
                                        borderRadius: "14px",
                                        boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
                                        display: "flex",
                                        overflow: "hidden",
                                        minHeight: "130px",
                                        transition: "box-shadow 0.2s",
                                    }}
                                >
                                    {/* Partie gauche — infos produit */}
                                    <div style={{
                                        flex: 2,
                                        padding: "20px 18px",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        borderRight: "1px solid #f1f5f9",
                                    }}>
                                        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "#1e293b", marginBottom: "6px" }}>
                                            {produit.nom}
                                        </h2>
                                        <p style={{ fontSize: "0.8rem", color: "#64748b", marginBottom: "4px" }}>
                                            Categorie : <strong>{produit.categorie}</strong>
                                        </p>
                                        <p style={{ fontSize: "0.8rem", color: produit.stock > 0 ? "#16a34a" : "#ef4444" }}>
                                            Stock : {produit.stock}
                                        </p>
                                    </div>

                                    {/* Partie droite — prix + panier */}
                                    <div style={{
                                        flex: 1,
                                        padding: "16px 12px",
                                        display: "flex",
                                        flexDirection: "column",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        background: "#f8fafc",
                                    }}>
                                        {/* Prix centré verticalement */}
                                        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <span style={{ fontSize: "1.15rem", fontWeight: 800, color: "#2563eb" }}>
                                                {produit.prix} €
                                            </span>
                                        </div>

                                        {/* Action panier en bas à droite */}
                                        <div style={{ alignSelf: "flex-end" }}>
                                            {quantitePanier === 0 ? (
                                                <button
                                                    onClick={() => ajouterAuPanier(produit, 1)}
                                                    title="Ajouter au panier"
                                                    style={{
                                                        width: "36px", height: "36px",
                                                        borderRadius: "50%",
                                                        border: "none",
                                                        background: "#2563eb",
                                                        color: "white",
                                                        fontSize: "1.3rem",
                                                        cursor: "pointer",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
                                                    }}
                                                >
                                                    +
                                                </button>
                                            ) : (
                                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                                    <button
                                                        onClick={() => modifierQuantite(produit._id!, quantitePanier - 1)}
                                                        style={{
                                                            width: "28px", height: "28px", borderRadius: "50%",
                                                            border: "none", background: "#ef4444", color: "white",
                                                            fontWeight: 700, cursor: "pointer", fontSize: "1rem",
                                                        }}
                                                    >
                                                        -
                                                    </button>
                                                    <span style={{ fontWeight: 700, color: "#1e293b", fontSize: "0.9rem", minWidth: "16px", textAlign: "center" }}>
                                                        {quantitePanier}
                                                    </span>
                                                    <button
                                                        onClick={() => modifierQuantite(produit._id!, quantitePanier + 1)}
                                                        style={{
                                                            width: "28px", height: "28px", borderRadius: "50%",
                                                            border: "none", background: "#2563eb", color: "white",
                                                            fontWeight: 700, cursor: "pointer", fontSize: "1rem",
                                                        }}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Catalogue;