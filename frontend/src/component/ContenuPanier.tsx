import { createContext, useContext, useState, ReactNode } from "react";
import { Produit } from "../model/produit";


export interface ArticlePanier {
    produit: Produit;
    quantite: number;
}

interface PanierContextType {
    panier: ArticlePanier[];
    ajouterAuPanier: (produit: Produit, quantite: number) => void;
    supprimerDuPanier: (produitId: string) => void;
    modifierQuantite: (produitId: string, quantite: number) => void;
    viderPanier: () => void;
    total: number;
}

const PanierContext = createContext<PanierContextType | undefined>(undefined);

export const PanierProvider = ({ children }: { children: ReactNode }) => {
    const [panier, setPanier] = useState<ArticlePanier[]>([]);

    const ajouterAuPanier = (produit: Produit, quantite: number) => {
        setPanier((prevPanier) => {
            const existe = prevPanier.find((item) => item.produit._id === produit._id);
            if (existe) {
                return prevPanier.map((item) =>
                    item.produit._id === produit._id
                        ? { ...item, quantite: item.quantite + quantite }
                        : item
                );
            }
            return [...prevPanier, { produit, quantite }];
        });
    };

    const supprimerDuPanier = (produitId: string) => {
        setPanier((prevPanier) =>
            prevPanier.filter((item) => item.produit._id !== produitId)
        );
    };

    const modifierQuantite = (produitId: string, quantite: number) => {
        if (quantite <= 0) {
            supprimerDuPanier(produitId);
            return;
        }
        setPanier((prevPanier) =>
            prevPanier.map((item) =>
                item.produit._id === produitId ? { ...item, quantite } : item
            )
        );
    };

    // viderPanier est une simple fonction void, rien d'autre
    const viderPanier = () => {
        setPanier([]);
    };

    // total est calculé ici, dans le corps du Provider, pas dans une fonction
    const total = panier.reduce(
        (acc, item) => acc + item.produit.prix * item.quantite,
        0
    );

    // Le return du JSX est bien dans PanierProvider, pas ailleurs
    return (
        <PanierContext.Provider
            value={{ panier, ajouterAuPanier, supprimerDuPanier, modifierQuantite, viderPanier, total }}
        >
            {children}
        </PanierContext.Provider>
    );
};

export const usePanier = () => {
    const context = useContext(PanierContext);
    if (!context) throw new Error("usePanier doit être utilisé dans un PanierProvider");
    return context;
};