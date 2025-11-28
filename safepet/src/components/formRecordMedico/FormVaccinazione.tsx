import React, { useState } from "react";
import "../formRecordMedico/form.scss";

type Props = {
    petId: number;
    onSuccess?: () => void;
    onClose?: () => void;
};

const getToday = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString().split("T")[0];
};

const FormVaccinazione: React.FC<Props> = ({ petId, onSuccess, onClose }) => {

    const [nomeVaccino, setNomeVaccino] = useState("");
    const [tipologia, setTipologia] = useState("");
    const [dataDiSomministrazione, setDataDiSomministrazione] = useState("");
    const [doseSomministrata, setDoseSomministrata] = useState("");
    const [viaDiSomministrazione, setViaDiSomministrazione] = useState("");
    const [effettiCollaterali, setEffettiCollaterali] = useState("");
    const [richiamoPrevisto, setRichiamoPrevisto] = useState("");

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const TOKEN = localStorage.getItem("token");

    // VALIDAZIONE COMPLETA
    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        // ID PET
        if (!petId || isNaN(petId) || petId <= 0) {
            newErrors.petId = "ID paziente non valido o mancante.";
        }

        // Nome vaccino: 3-20 caratteri
        if (!nomeVaccino.trim()) newErrors.nomeVaccino = "Il nome del vaccino è obbligatorio";
        else if (nomeVaccino.length < 3 || nomeVaccino.length > 20)
            newErrors.nomeVaccino = "Il nome deve essere tra 3 e 20 caratteri";

        // Tipologia: 3-20 caratteri
        if (!tipologia.trim()) newErrors.tipologia = "La tipologia è obbligatoria";
        else if (tipologia.length < 3 || tipologia.length > 20)
            newErrors.tipologia = "La tipologia deve essere tra 3 e 20 caratteri";

        // Data somministrazione
        if (!dataDiSomministrazione) {
            newErrors.dataDiSomministrazione = "La data di somministrazione è obbligatoria";
        } else {
            const som = new Date(dataDiSomministrazione);
            const today = new Date();
            som.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            if (som > today)
                newErrors.dataDiSomministrazione = "La data non può essere futura";
        }

        // Dose
        if (!doseSomministrata) {
            newErrors.doseSomministrata = "La dose è obbligatoria";
        } else {
            const n = Number(doseSomministrata);
            if (isNaN(n)) newErrors.doseSomministrata = "La dose deve essere un numero";
            else if (n < 0) newErrors.doseSomministrata = "La dose non può essere negativa";
            else if (n < 0.1 || n > 10)
                newErrors.doseSomministrata = "Dose compresa tra 0.1 e 10 ml";
        }

        // Via somministrazione
        if (!viaDiSomministrazione.trim())
            newErrors.viaDiSomministrazione = "La via di somministrazione è obbligatoria";

        // Effetti collaterali: max 200 char
        if (effettiCollaterali.length > 200)
            newErrors.effettiCollaterali = "Max 200 caratteri";

        // Richiamo: almeno 21 giorni dopo
        if (!richiamoPrevisto)
            newErrors.richiamoPrevisto = "La data del richiamo è obbligatoria";
        else if (dataDiSomministrazione) {
            const som = new Date(dataDiSomministrazione);
            const richiamo = new Date(richiamoPrevisto);

            const minDate = new Date(som);
            minDate.setDate(minDate.getDate() + 21);

            if (richiamo < minDate)
                newErrors.richiamoPrevisto =
                    `Il richiamo deve essere almeno 21 giorni dopo (${minDate.toLocaleDateString()})`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // SUBMIT
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            if (errors.petId)
                setServerError("ID Paziente non valido. Impossibile registrare la vaccinazione.");
            return;
        }

        setSubmitting(true);
        setServerError(null);

        const payload = {
            nomeVaccino,
            tipologia,
            dataDiSomministrazione,
            doseSomministrata: Number(doseSomministrata),
            viaDiSomministrazione,
            effettiCollaterali,
            richiamoPrevisto
        };

        try {
            const res = await fetch(
                `http://localhost:8080/gestioneCartellaClinica/aggiungiVaccinazione/${petId}`,
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
                let errorMessage = text || "Errore dal server";
                try {
                    const json = JSON.parse(text);
                    errorMessage = json.detail || json.title || errorMessage;
                } catch {}
                setServerError(errorMessage);
                setSubmitting(false);
                return;
            }

            onSuccess?.();
            onClose?.();

            // Reset locale (opzionale)
            setNomeVaccino("");
            setTipologia("");
            setDataDiSomministrazione("");
            setDoseSomministrata("");
            setViaDiSomministrazione("");
            setEffettiCollaterali("");
            setRichiamoPrevisto("");

        } catch (err: any) {
            setServerError(err.message);
        } finally {
            setSubmitting(false);
        }
        console.log("Vaccinazione registrata con successo!");
    };

    // FORM
    return (
        <div className="form-RecordMedico">
            <div className="modal-overlay">
                <div className="modal-box">
                    <h2>Registra nuova vaccinazione</h2>

                    <form onSubmit={handleSubmit}>

                        {/* Nome vaccino */}
                        <div className="user-box">
                            <input
                                type="text"
                                value={nomeVaccino}
                                onChange={e => setNomeVaccino(e.target.value)}
                                placeholder=" "
                            />
                            <label>Nome vaccino</label>
                            {errors.nomeVaccino && <div className="msg-error">{errors.nomeVaccino}</div>}
                        </div>

                        {/* Tipologia */}
                        <div className="user-box">
                            <input
                                type="text"
                                value={tipologia}
                                onChange={e => setTipologia(e.target.value)}
                                placeholder=" "
                            />
                            <label>Tipologia</label>
                            {errors.tipologia && <div className="msg-error">{errors.tipologia}</div>}
                        </div>

                        {/* Data di somministrazione */}
                        <div className="user-box">
                            <input
                                type="date"
                                value={dataDiSomministrazione}
                                max={getToday()}
                                onChange={e => setDataDiSomministrazione(e.target.value)}
                                placeholder=" "
                            />
                            <label>Data somministrazione</label>
                            {errors.dataDiSomministrazione && (
                                <div className="msg-error">{errors.dataDiSomministrazione}</div>
                            )}
                        </div>

                        {/* Dose */}
                        <div className="user-box">
                            <input
                                type="number"
                                step="0.1"
                                value={doseSomministrata}
                                onChange={e => setDoseSomministrata(e.target.value)}
                                placeholder=" "
                            />
                            <label>Dose (ml)</label>
                            {errors.doseSomministrata && (
                                <div className="msg-error">{errors.doseSomministrata}</div>
                            )}
                        </div>

                        {/* Via */}
                        <div className="user-box">
                            <select
                                value={viaDiSomministrazione}
                                onChange={e => setViaDiSomministrazione(e.target.value)}
                            >
                                <option value="">Seleziona</option>
                                <option value="SOTTOCUTANEA">Sottocutanea</option>
                                <option value="INTRAMUSCOLARE">Intramuscolare</option>
                                <option value="ORALE">Orale</option>
                                <option value="INTRANASALE">Intranasale</option>
                                <option value="TRANSDERMICA">Transdermica</option>
                            </select>
                            <label>Via di somministrazione</label>
                            {errors.viaDiSomministrazione && (
                                <div className="msg-error">{errors.viaDiSomministrazione}</div>
                            )}
                        </div>

                        {/* Effetti collaterali */}
                        <div className="user-box">
                            <textarea
                                value={effettiCollaterali}
                                onChange={e => setEffettiCollaterali(e.target.value)}
                                placeholder=" "
                            />
                            <label>Effetti collaterali (opzionale)</label>
                            {errors.effettiCollaterali && (
                                <div className="msg-error">{errors.effettiCollaterali}</div>
                            )}
                        </div>

                        {/* Richiamo previsto */}
                        <div className="user-box">
                            <input
                                type="date"
                                value={richiamoPrevisto}
                                onChange={e => setRichiamoPrevisto(e.target.value)}
                                placeholder=" "
                            />
                            <label>Richiamo previsto</label>
                            {errors.richiamoPrevisto && (
                                <div className="msg-error">{errors.richiamoPrevisto}</div>
                            )}
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
                                disabled={submitting}
                                className="button-primary-Patologia"
                            >
                                {submitting ? "Salvataggio..." : "Salva vaccinazione"}
                            </button>

                            <button type="button" className="button-primary-Patologia" onClick={onClose}>
                                Chiudi
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormVaccinazione;
