import { useState } from "react";
import FormVisitaMedica from "../components/formRecordMedico/FormVisitaMedica";

const TestVisitaMedica: React.FC = () => {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="page-container">
            <h2>Test Registrazione Visita Medica</h2>

            <button onClick={() => setShowForm(true)}>Apri form visita medica</button>

            {showForm && (
                <FormVisitaMedica
                    petId={1}
                    onSuccess={(data) => {
                        console.log("Visita Medica registrata:", data);
                        setShowForm(false);
                    }}
                    onClose={() => setShowForm(false)}
                />
            )}
        </div>
    );
};

export default TestVisitaMedica;