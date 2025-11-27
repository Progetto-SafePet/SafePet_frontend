import { useState } from "react";
import FormTerapia from "../components/formRecordMedico/formTerapia";

const TestTerapia: React.FC = () => {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="page-container">
            <h2>Test Registrazione Terapia</h2>

            <button onClick={() => setShowForm(true)}>
                Apri form terapia
            </button>

            {showForm && (
                <FormTerapia
                    petId={1}
                    onSuccess={(response) => {
                        console.log("Terapia registrata:", response);
                        setShowForm(false);
                    }}
                    onClose={() => setShowForm(false)}
                />
            )}
        </div>
    );
};

export default TestTerapia;
