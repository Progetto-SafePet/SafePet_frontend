import React, { useState } from "react";
import "../formRecordMedico/form.scss";

type Props = {
    petId: number;
    onSuccess?: () => void;
    onClose?: () => void;
};

const FormTerapia: React.FC<Props> = ({ petId, onSuccess, onClose }) => {
    const [nome, setNome] = useState("");
    const [formaFarmaceutica, setFormaFarmaceutica] = useState("");
    const [dosaggio, setDosaggio] = useState("");
    const [posologia, setPosologia] = useState("");
    const [viaDiSomministrazione, setViaDiSomministrazione] = useState("");
    const [durata, setDurata] = useState("");
    const [frequenza, setFrequenza] = useState("");
    const [motivo, setMotivo] = useState("");

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const TOKEN = localStorage.getItem("token");

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        // Controllo ID paziente (in più rispetto al form patologia)
        if (!petId || isNaN(petId) || petId <= 0) {
            newErrors.petId = "ID paziente non valido o mancante.";
        }

        // Nome farmaco: obbligatorio e 3–100 caratteri
        if (!nome.trim()) newErrors.nome = "Il nome è obbligatorio";
        else if (nome.length < 3 || nome.length > 100)
            newErrors.nome = "Il nome deve essere compreso tra 3 e 100 caratteri";

        // Forma farmaceutica: obbligatoria
        if (!formaFarmaceutica.trim())
            newErrors.formaFarmaceutica = "La forma farmaceutica è obbligatoria";

        // Dosaggio: obbligatorio
        if (!dosaggio.trim())
            newErrors.dosaggio = "Il dosaggio è obbligatorio";

        // Posologia: obbligatoria
        if (!posologia.trim())
            newErrors.posologia = "La posologia è obbligatoria";

        // Via di somministrazione: obbligatoria
        if (!viaDiSomministrazione.trim())
            newErrors.viaDiSomministrazione = "La via di somministrazione è obbligatoria";

        // Durata: obbligatoria
        if (!durata.trim())
            newErrors.durata = "La durata è obbligatoria";

        // Frequenza: obbligatoria
        if (!frequenza.trim())
            newErrors.frequenza = "La frequenza è obbligatoria";

        // Motivo: obbligatorio
        if (!motivo.trim())
            newErrors.motivo = "Il motivo è obbligatorio";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            // Se l'errore è proprio l'ID paziente, mostro anche un messaggio generale
            if (!petId || isNaN(petId) || petId <= 0) {
                setServerError("ID Paziente non valido. Impossibile salvare la terapia.");
            }
            return;
        }

        setSubmitting(true);
        setServerError(null);

        const payload = {
            nome,
            formaFarmaceutica,
            dosaggio,
            posologia,
            viaDiSomministrazione,
            durata,
            frequenza,
            motivo
        };

        try {
            const res = await fetch(
                `http://localhost:8080/gestioneCartellaClinica/aggiungiTerapia/${petId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {})
                    },
                    body: JSON.stringify(payload)
                }
            );

            if (!res.ok) {
                const text = await res.text();
                let errorMessage = text || "Errore dal server durante il salvataggio.";
                // Provo a leggere JSON (es. error response Spring)
                try {
                    const errorJson = JSON.parse(text);
                    errorMessage = errorJson.detail || errorJson.title || errorMessage;
                } catch {
                    // se non è JSON lascio il text grezzo
                }

                setServerError(errorMessage);
                setSubmitting(false);
                return;
            }

            // NIENTE redirect, niente console.log.
            // Lascio gestire al padre (es. refresh cartella clinica + chiusura modal)
            onSuccess?.();
            onClose?.();

            // opzionale: reset dei campi in locale (utile se il form resta aperto)
            setNome("");
            setFormaFarmaceutica("");
            setDosaggio("");
            setPosologia("");
            setViaDiSomministrazione("");
            setDurata("");
            setFrequenza("");
            setMotivo("");

        } catch (err: any) {
            const errorMessage = err instanceof Error ? err.message : "Errore di rete";
            setServerError(errorMessage);
        } finally {
            setSubmitting(false);
        }
        console.log("Terapia registrata con successo!");
    };

    // Niente schermate separate di errore: lo gestiamo come gli altri form modali
    return (
        <div className="form-RecordMedico">
            <div className="modal-overlay">
                <div className="modal-box">
                    <h2>Registra nuova terapia</h2>

                    <form onSubmit={handleSubmit}>

                        {/* NOME FARMACO */}
                        <div className="user-box">
                            <input
                                type="text"
                                value={nome}
                                onChange={e => setNome(e.target.value)}
                                placeholder=" "
                            />
                            <label>Nome farmaco</label>
                            {errors.nome && <div className="msg-error">{errors.nome}</div>}
                        </div>

                        {/* FORMA FARMACEUTICA */}
                        <div className="user-box">
                            <input
                                type="text"
                                value={formaFarmaceutica}
                                onChange={e => setFormaFarmaceutica(e.target.value)}
                                placeholder=" "
                            />
                            <label>Forma farmaceutica</label>
                            {errors.formaFarmaceutica && (
                                <div className="msg-error">{errors.formaFarmaceutica}</div>
                            )}
                        </div>

                        {/* DOSAGGIO */}
                        <div className="user-box">
                            <input
                                type="text"
                                value={dosaggio}
                                onChange={e => setDosaggio(e.target.value)}
                                placeholder=" "
                            />
                            <label>Dosaggio</label>
                            {errors.dosaggio && <div className="msg-error">{errors.dosaggio}</div>}
                        </div>

                        {/* POSOLOGIA */}
                        <div className="user-box">
                            <textarea
                                value={posologia}
                                onChange={e => setPosologia(e.target.value)}
                                placeholder=" "
                            />
                            <label>Posologia</label>
                            {errors.posologia && <div className="msg-error">{errors.posologia}</div>}
                        </div>

                        {/* VIA DI SOMMINISTRAZIONE */}
                        <div className="user-box">
                            <input
                                type="text"
                                value={viaDiSomministrazione}
                                onChange={e => setViaDiSomministrazione(e.target.value)}
                                placeholder=" "
                            />
                            <label>Via di somministrazione</label>
                            {errors.viaDiSomministrazione && (
                                <div className="msg-error">{errors.viaDiSomministrazione}</div>
                            )}
                        </div>

                        {/* DURATA */}
                        <div className="user-box">
                            <input
                                type="text"
                                value={durata}
                                onChange={e => setDurata(e.target.value)}
                                placeholder=" "
                            />
                            <label>Durata</label>
                            {errors.durata && <div className="msg-error">{errors.durata}</div>}
                        </div>

                        {/* FREQUENZA */}
                        <div className="user-box">
                            <input
                                type="text"
                                value={frequenza}
                                onChange={e => setFrequenza(e.target.value)}
                                placeholder=" "
                            />
                            <label>Frequenza</label>
                            {errors.frequenza && <div className="msg-error">{errors.frequenza}</div>}
                        </div>

                        {/* MOTIVO */}
                        <div className="user-box">
                            <textarea
                                value={motivo}
                                onChange={e => setMotivo(e.target.value)}
                                placeholder=" "
                            />
                            <label>Motivo</label>
                            {errors.motivo && <div className="msg-error">{errors.motivo}</div>}
                        </div>

                        {/* ERRORI GLOBALI */}
                        {(errors.petId || serverError) && (
                            <div className="msg-error">
                                {errors.petId && <div>{errors.petId}</div>}
                                {serverError && <div>{serverError}</div>}
                            </div>
                        )}

                        <div className="side-boxes-login">
                            <button
                                type="submit"
                                className="button-primary-Patologia"
                                disabled={submitting}
                            >
                                {submitting ? "Salvataggio..." : "Salva terapia"}
                            </button>

                            <button
                                type="button"
                                className="button-primary-Patologia"
                                onClick={onClose}
                            >
                                Chiudi
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormTerapia;
