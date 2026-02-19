import { updateAdherent } from "../../api/adherent";
import FormProduit from "../../component/form/FormProduit";
import { Adherent } from "../../model/adherent";

const ModifierAdherent = ({ Adherent }: { Adherent: Adherent }) => (
    <div className="max-w-md mx-auto mt-8 p-6 border rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Modifier un adherent</h2>
        <FormProduit
            initialData={Adherent}
            onSubmit={(data) => updateAdherent(Adherent._id!, data)}
            submitLabel="Modifier"
        />
    </div>
);

export default ModifierAdherent;