import { useState } from "react";
import FormVaccinazione from "../components/formRecordMedico/FormVaccinazione";

const TestVaccinazione: React.FC = () => {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="page-container">
            <h2>Test Registrazione Vaccinazione</h2>

            <button onClick={() => setShowForm(true)}>
                Apri form vaccinazione
            </button>

            {showForm && (
                <FormVaccinazione
                    petId={1} // <-- metti l'id di un pet reale associato al vet loggato
                    onSuccess={(data) => {
                        console.log("Vaccinazione registrata:", data);
                        setShowForm(false);
                    }}
                    onClose={() => setShowForm(false)}
                />
            )}
        </div>
    );
};

export default TestVaccinazione;
