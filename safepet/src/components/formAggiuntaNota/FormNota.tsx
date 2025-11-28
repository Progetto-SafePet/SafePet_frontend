import { useState } from "react";
import "./AggiungiNota.scss";
type Props = {
    petId: number;
    onSuccess?: (data: any) => void;
    onClose?: () => void;
};

const FormNota: React.FC<Props> = ({ petId, onSuccess, onClose }) => {
    const [titolo, setTitolo] = useState("");
    const [descrizione, setDescrizione] = useState("");
    const [error, setError] = useState({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const TOKEN = localStorage.getItem("token");

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!titolo.trim()) {
            newErrors.titolo = "Il titolo della nota è obbligatorio";
        } else if (titolo.length > 100) {
            newErrors.titolo = "Il titolo non può superare i 100 caratteri";
        }

        if (!descrizione.trim()) {
            newErrors.descrizione = "La descrizione della nota è obbligatoria";
        } else if (descrizione.length > 300) {
            newErrors.descrizione = "La descrizione non può superare i 300 caratteri";
        }

        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const creaNota = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        setServerError(null);

        const payload = {
            titolo,
            descrizione,
            petId: Number(petId)
        };

        try {
            const response = await fetch(
                `http://localhost:8080/gestionePet/creaNota/${petId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${TOKEN}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!response.ok) {
                const text = await response.text();
                setServerError(text || "Errore dal server");
                setSubmitting(false);
                return;
            }

            const data = await response.json();
            onSuccess?.(data);

            setTitolo("");
            setDescrizione("");

            onClose?.(); // chiude modal
        } catch (err: any) {
            setServerError(error.message || "Errore di rete");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="note-proprietario">
            <div className="modal-overlay">
                <div className="modal-box">
                    <h2>Aggiungi la tua nota</h2>
                    <form onSubmit={creaNota}>
                        <div className="user-box">
                            <input
                                type="text"
                                value={titolo}
                                onChange={e => setTitolo(e.target.value)}
                                placeholder=" "
                            />
                            <label>Titolo</label>
                            {error.titolo && <div className="msg-error">{error.titolo}</div>}
                        </div>

                        <div className="user-box">
                            <input
                                type="descrizione"
                                value={descrizione}
                                onChange={e => setDescrizione(e.target.value)}
                                placeholder=" "
                            />
                            <label>Descrizione</label>
                            {error.descrizione && <div className="msg-error">{error.descrizione}</div>}
                        </div>

                        {serverError && <div className="msg-error">{serverError}</div>}

                        <div className="side-boxes-login">
                            <button type="submit" className="button-primary-Nota" disabled={submitting}>
                                {submitting ? "Salvataggio..." : "Salva nota"}
                            </button>
                            <button type="button" className="button-primary-Nota" onClick={onClose}>Chiudi</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormNota;