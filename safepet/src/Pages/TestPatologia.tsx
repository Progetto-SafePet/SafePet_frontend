import { useState } from "react";
import FormPatologia from "../components/formRecordMedico/formPatologia";

const TestPatologia: React.FC = () => {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="page-container">
            <h2>Test Registrazione Patologia</h2>

            <button onClick={() => setShowForm(true)}>Apri form patologia</button>

            {showForm && (
                <FormPatologia
                    petId={1}
                    onSuccess={(data) => {
                        console.log("Patologia registrata:", data);
                        setShowForm(false);
                    }}
                    onClose={() => setShowForm(false)}
                />
            )}
        </div>
    );
};

export default TestPatologia;
