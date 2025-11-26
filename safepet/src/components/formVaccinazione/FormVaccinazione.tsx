import { useState } from "react";
import "./FormVaccinazione.scss";

type Props = {
    petId: number;
    onSuccess?: (data: any) => void;
    onClose?: () => void;
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

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!nomeVaccino.trim())
            newErrors.nomeVaccino = "Il nome del vaccino è obbligatorio";
        else if (nomeVaccino.length < 3 || nomeVaccino.length > 20)
            newErrors.nomeVaccino = "Nome vaccino 3-20 caratteri";

        if (!tipologia.trim())
            newErrors.tipologia = "La tipologia è obbligatoria";
        else if (tipologia.length < 3 || tipologia.length > 20)
            newErrors.tipologia = "Tipologia 3-20 caratteri";

        if (!dataDiSomministrazione)
            newErrors.dataDiSomministrazione = "La data di somministrazione è obbligatoria";

        if (!doseSomministrata)
            newErrors.doseSomministrata = "La dose è obbligatoria";
        else {
            const dose = Number(doseSomministrata);
            if (isNaN(dose) || dose < 0.1 || dose > 10)
                newErrors.doseSomministrata = "Dose compresa tra 0.1 e 10 ml";
        }

        if (!viaDiSomministrazione)
            newErrors.viaDiSomministrazione = "La via di somministrazione è obbligatoria";

        if (effettiCollaterali.length > 200)
            newErrors.effettiCollaterali = "Max 200 caratteri";

        if (!richiamoPrevisto)
            newErrors.richiamoPrevisto = "La data del richiamo è obbligatoria";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        setServerError(null);

        // JSON che rispecchia il VaccinazioneRequestDTO lato backend
        const payload = {
            nomeVaccino,
            tipologia,
            dataDiSomministrazione, // "yyyy-MM-dd" dall'input type="date"
            doseSomministrata: Number(doseSomministrata),
            viaDiSomministrazione,  // es. "SOTTOCUTANEA"
            effettiCollaterali,
            richiamoPrevisto        // "yyyy-MM-dd"
        };

        try {
            const res = await fetch(
                `http://localhost:8080/gestioneCartellaClinica/aggiungiVaccinazione/${petId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) {
                const text = await res.text();
                setServerError(text || "Errore dal server");
                setSubmitting(false);
                return;
            }

            const data = await res.json();
            onSuccess?.(data);

            // reset campi
            setNomeVaccino("");
            setTipologia("");
            setDataDiSomministrazione("");
            setDoseSomministrata("");
            setViaDiSomministrazione("");
            setEffettiCollaterali("");
            setRichiamoPrevisto("");

            onClose?.();
        } catch (err: any) {
            setServerError(err.message || "Errore di rete");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="modal-overlay">
            <div className="modal-box">
                <h2>Registra nuova vaccinazione</h2>
                <form onSubmit={handleSubmit}>
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

                    <div className="user-box">
                        <input
                            type="date"
                            value={dataDiSomministrazione}
                            onChange={e => setDataDiSomministrazione(e.target.value)}
                            placeholder=" "
                        />
                        <label>Data di somministrazione</label>
                        {errors.dataDiSomministrazione && (
                            <div className="msg-error">{errors.dataDiSomministrazione}</div>
                        )}
                    </div>

                    <div className="user-box">
                        <input
                            type="number"
                            step="0.1"
                            value={doseSomministrata}
                            onChange={e => setDoseSomministrata(e.target.value)}
                            placeholder=" "
                        />
                        <label>Dose somministrata (ml)</label>
                        {errors.doseSomministrata && (
                            <div className="msg-error">{errors.doseSomministrata}</div>
                        )}
                    </div>

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

                    <div className="user-box">
                        <textarea
                            value={effettiCollaterali}
                            onChange={e => setEffettiCollaterali(e.target.value)}
                            placeholder=" "
                        />
                        <label>Effetti collaterali</label>
                        {errors.effettiCollaterali && (
                            <div className="msg-error">{errors.effettiCollaterali}</div>
                        )}
                    </div>

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

                    {serverError && <div className="msg-error">{serverError}</div>}

                    <div className="side-boxes-login">
                        <button
                            type="submit"
                            className="button-primary-Vaccinazione"
                            disabled={submitting}
                        >
                            {submitting ? "Salvataggio..." : "Salva"}
                        </button>
                        <button
                            type="button"
                            className="button-primary-Vaccinazione"
                            onClick={onClose}
                        >
                            Chiudi
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormVaccinazione;
