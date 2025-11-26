import { useState } from "react";
import FormNota from "../components/formAggiuntaNota/AggiungiNota";

const TestNota: React.FC = () => {
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="page-container">
            <h2>Test aggiunta nota</h2>

            <button onClick={() => setShowForm(true)}>Apri form aggiunta nota</button>

            {showForm && (
                <FormNota
                    petId={1}
                    onSuccess={(data) => {
                        console.log("Nota registrata:", data);
                        setShowForm(false);
                    }}
                    onClose={() => setShowForm(false)}
                />
            )}
        </div>
    );
};

export default TestNota;