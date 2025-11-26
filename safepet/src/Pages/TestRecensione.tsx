import { useState } from "react";
import FormRecensione from "../components/formAggiuntaRecensione/AggiungiRecensione";
import { CONSTANTS } from "../constants";

const TestRecensione: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    // ID di un veterinario esistente per il test
    const VETERINARIO_ID_TEST = 2;

    const userRole = localStorage.getItem('role') || CONSTANTS.ROLE.PROPRIETARIO;
    const isOwner = userRole === CONSTANTS.ROLE.PROPRIETARIO;

    if (!isOwner) {
        return (
            <div className="page-container">
                <h2>Accesso Negato</h2>
                <p>Devi essere un Proprietario per lasciare una recensione.</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <h2>Test Aggiunta Recensione</h2>
            <p>ID Veterinario di test: <strong>{VETERINARIO_ID_TEST}</strong></p>

            <button onClick={() => setShowForm(true)} disabled={!isOwner}>
                {isOwner ? "Apri form Aggiunta Recensione" : "Accesso Negato"}
            </button>

            {showForm && (
                <FormRecensione
                    veterinarioId={VETERINARIO_ID_TEST}
                    onSuccess={(data) => {
                        console.log("Recensione registrata:", data);
                        setShowForm(false);
                    }}
                    onClose={() => setShowForm(false)}
                />
            )}
        </div>
    );
};

export default TestRecensione;