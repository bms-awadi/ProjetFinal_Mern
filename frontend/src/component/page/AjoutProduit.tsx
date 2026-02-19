import { createProduit } from "../../api/produit";
import FormProduit from "../form/FormProduit";

const AjoutProduit = () => (
    <div className="max-w-md mx-auto mt-8 p-6 border rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Ajouter un produit</h2>
        <FormProduit
            onSubmit={createProduit}
            submitLabel="Ajouter"
        />
    </div>
);

export default AjoutProduit;