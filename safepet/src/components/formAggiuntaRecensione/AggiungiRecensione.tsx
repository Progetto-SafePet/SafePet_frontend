import { useState } from "react";
import axios from "axios";
import "./AggiungiRecensione.scss";

type Props = {
    veterinarioId: number;
    onSuccess?: (data: any) => void;
    onClose?: () => void;
};

const FormRecensione: React.FC<Props> = ({ veterinarioId, onSuccess, onClose }) => {
    // Stati per i dati del form
    const [punteggio, setPunteggio] = useState(0);
    const [descrizione, setDescrizione] = useState("");

    // Stati di gestione UI e errori
    const [error, setError] = useState<{ [key: string]: string }>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Recupero del token di autenticazione
    const TOKEN = localStorage.getItem("token");

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        // Validazione Punteggio (obbligatorio e nel range 1-5)
        if (punteggio < 1 || punteggio > 5) {
            newErrors.punteggio = "Seleziona un punteggio da 1 a 5";
        }

        // Validazione descrizione (obbligatorio)
        if (!descrizione.trim()) {
            newErrors.descrizione = "La descrizione è obbligatoria";
        } else if (descrizione.length > 100) {
            newErrors.descrizione = "La descrizione non può superare i 100 caratteri";
        }

        setError(newErrors);
        // *** AGGIUNGI QUESTO LOG ***
        console.log("Errore di validazione (Punteggio):", newErrors.punteggio);
        console.log("Stato degli errori dopo il set:", newErrors);
        // *************************
        return Object.keys(newErrors).length === 0;
    };

    const creaRecensione = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        setServerError(null);

        const payload = {
            punteggio,
            descrizione,
        };

        if (!TOKEN) {
            setServerError("Errore: Token di autenticazione non trovato. Esegui il login.");
            setSubmitting(false);
            return; // Blocca l'invio se non c'è il token
        }

        try {
            const response = await axios.post(
                `http://localhost:8080/gestioneRecensioni/veterinari/${veterinarioId}/recensioni`,
                payload,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${TOKEN}`,
                    },
                }
            );

            onSuccess?.(response.data);

            // Reset e chiusura
            setPunteggio(0);
            setDescrizione("");
            onClose?.();

        } catch (err: any) {
            // Gestione dell'errore
            const errorMessage = err.response && err.response.data && err.response.data.message
                ? err.response.data.message
                : "Errore durante l'invio della recensione. Controlla che tu non abbia già recensito questo veterinario.";
            setServerError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    // Funzione per renderizzare le stelle
    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    style={{
                        cursor: 'pointer',
                        color: i <= punteggio ? 'gold' : 'lightgray',
                        fontSize: '30px',
                        margin: '0 2px'
                    }}
                    onClick={() => setPunteggio(i)}
                >
                    ★
                </span>
            );
        }
        return stars;
    };

    return (
        <div className="aggiunta-recensione">
            <div className="modal-overlay">
                <div className="modal-box">
                    <h2>Lascia una Recensione</h2>
                    <form onSubmit={creaRecensione}>

                        {/* CAMPO RATING (STELLE) */}
                        <div className="user-box rating-box">
                            <div style={{padding: '10px 0'}}>
                                {renderStars()}
                            </div>
                            {error.punteggio && <div className="msg-error">{error.punteggio}</div>}
                        </div>

                        {/* CAMPO Descrizione */}
                        <div className="user-box">
                        <textarea
                            id="descrizione"
                            value={descrizione}
                            onChange={e => setDescrizione(e.target.value)}
                            rows={4}
                            placeholder="Lascia una descrizione..."
                        />
                            {error.descrizione && <div className="msg-error">{error.descrizione}</div>}
                        </div>

                        {serverError && <div className="msg-error">{serverError}</div>}

                        <div className="side-boxes-login">
                            <button
                                type="submit"
                                className="button-primary-Recensione"
                                disabled={submitting}
                            >
                                {submitting ? "Salvataggio..." : "Invia"}
                            </button>
                            <button type="button" className="button-primary-Recensione" onClick={onClose}>Chiudi
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormRecensione;