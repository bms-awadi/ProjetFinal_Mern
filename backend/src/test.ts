import axios from "axios";

const API = "http://localhost:3001/api";

async function runTests() {
    try {
        // =========================
        // 1. Création d’un produit
        // =========================
        const produitRes = await axios.post(`${API}/produits`, {
            nom: "Clavier Test",
            stock: 20,
            categorie: "Informatique",
            prix: 59,
        });


        const produit = produitRes.data;
        console.log("Produit créé :", produit._id);

        // =========================
        // 2. Création d’un adhérent
        // =========================
        const adherentRes = await axios.post(`${API}/adherents`, {
            nom: "Durand",
            prenom: "Alice",
            role: "client",
            mdp: "password123",
            email: `alice.durand${Date.now()}@test.com`,
        });

        const adherent = adherentRes.data;
        console.log("Adhérent créé :", adherent._id);

        // =========================
        // 3. Création d’une commande
        // =========================
        const commandeRes = await axios.post(`${API}/commandes`, {
            adherent: adherent._id,
            produit: produit._id,
            quantite: 3,
        });

        console.log("Commande créée :", commandeRes.data._id);

        // =========================
        // 4. Récupération des listes
        // =========================
        const produitsList = await axios.get(`${API}/produits`);
        console.log("Nombre de produits :", produitsList.data.length);

        const adherentsList = await axios.get(`${API}/adherents`);
        console.log("Nombre d’adhérents :", adherentsList.data.length);

        // =========================
        // 5. Mise à jour du produit
        // =========================
        const updateProduit = await axios.put(`${API}/produits/${produit._id}`, {
            nom: produit.nom,
            stock: 50,
            categorie: produit.categorie,
            prix: produit.prix
        });


        console.log("Produit mis à jour, nouveau stock :", updateProduit.data.stock);

        // =========================
        // 6. Suppression de la commande
        // =========================
        await axios.delete(`${API}/commandes/${commandeRes.data._id}`);
        console.log("Commande supprimée");

        // =========================
        // 7. Suppression de l’adhérent
        // =========================
        await axios.delete(`${API}/adherents/${adherent._id}`);
        console.log("Adhérent supprimé");

        // =========================
        // 8. Suppression du produit
        // =========================
        await axios.delete(`${API}/produits/${produit._id}`);
        console.log("Produit supprimé");

        console.log("Tests terminés avec succès");
    } catch (error: any) {
        console.error(
            "Erreur pendant les tests :",
            error.response?.data || error.message
        );
    }
}

runTests();
