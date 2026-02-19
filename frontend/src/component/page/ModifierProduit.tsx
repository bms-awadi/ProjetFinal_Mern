import { updateProduit } from "../../api/produit";
import FormProduit from "../../component/form/FormProduit";
import { Produit } from "../../model/produit";

const ModifierProduit = ({ produit }: { produit: Produit }) => (
    <div className="max-w-md mx-auto mt-8 p-6 border rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Modifier un produit</h2>
        <FormProduit
            initialData={produit}
            onSubmit={(data) => updateProduit(produit._id!, data)}
            submitLabel="Modifier"
        />
    </div>
);

export default ModifierProduit;