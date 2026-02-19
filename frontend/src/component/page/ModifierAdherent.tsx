import { updateAdherent } from "../../api/adherent";
import FormAdherent from "../../component/form/FormAdherent";
import { Adherent } from "../../model/adherent";

const ModifierAdherent = ({ adherent, onSuccess }: { adherent: Adherent; onSuccess?: () => void }) => (
    <div className="max-w-md mx-auto mt-8 p-6 border rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Modifier un adherent</h2>
        <FormAdherent
            initialData={adherent}
            onSubmit={(data) => updateAdherent(adherent._id!, data)}
            onSuccess={onSuccess}
            submitLabel="Modifier"
        />
    </div>
);

export default ModifierAdherent;