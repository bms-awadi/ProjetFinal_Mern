import { createAdherent } from "../../api/adherent";
import FormAdherent from "../form/FormAdherent";

const AjoutAdherent = () => (
    <div className="max-w-md mx-auto mt-8 p-6 border rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Ajouter un adherent</h2>
        <FormAdherent
            onSubmit={createAdherent}
            submitLabel="Ajouter"
        />
    </div>
);

export default AjoutAdherent;