import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../formRecordMedico/form.scss";

const FormTerapia: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const petId = id ? Number(id) : undefined;
    const navigate = useNavigate();

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

        if (!petId || isNaN(petId) || petId <= 0) {
            newErrors.petId = "ID paziente non valido o mancante.";
        }

        if (!nome.trim()) newErrors.nome = "Il nome è obbligatorio";
        else if (nome.length < 3 || nome.length > 100)
            newErrors.nome = "Nome 3-100 caratteri";

        if (!formaFarmaceutica.trim())
            newErrors.formaFarmaceutica = "La forma farmaceutica è obbligatoria";

        if (!dosaggio.trim())
            newErrors.dosaggio = "Il dosaggio è obbligatorio";

        if (!posologia.trim())
            newErrors.posologia = "La posologia è obbligatoria";

        if (!viaDiSomministrazione.trim())
            newErrors.viaDiSomministrazione = "La via di somministrazione è obbligatoria";

        if (!durata.trim())
            newErrors.durata = "La durata è obbligatoria";

        if (!frequenza.trim())
            newErrors.frequenza = "La frequenza è obbligatoria";

        if (!motivo.trim())
            newErrors.motivo = "Il motivo è obbligatorio";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            if (errors.petId) {
                setServerError("ID Paziente non valido. Impossibile salvare la terapia.");
            }
            return;
        }

        setSubmitting(true);
        setServerError(null);

        const requestBody = {
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
                    body: JSON.stringify(requestBody)
                }
            );

            if (!res.ok) {
                const text = await res.text();
                let errorMessage = text || "Errore dal server durante il salvataggio.";
                try {
                    const errorJson = JSON.parse(text);
                    errorMessage = errorJson.detail || errorJson.title || errorMessage;
                } catch {}

                setServerError(errorMessage);
                setSubmitting(false);
                return;
            }

            alert("Terapia registrata con successo!");

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
    };

    if (!petId || isNaN(petId) || petId <= 0) {
        return (
            <div className="aggiunta-Terapia">
                <div className="modal-overlay">
                    <div className="modal-box error-state">
                        <h2>Errore Critico</h2>
                        <div className="msg-error">
                            ID Paziente non fornito o non valido. Impossibile registrare la terapia.
                        </div>
                        <div className="side-boxes-login">
                            <button type="button" className="button-primary-Terapia" onClick={() => navigate(-1)}>Torna indietro</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="form-RecordMedico">
            <div className="modal-overlay">
                <div className="modal-box">
                    <h2>Aggiungi Terapia (Pet ID: {petId})</h2>

                    <form onSubmit={handleSubmit}>

                        <div className="user-box">
                            <input
                                type="text"
                                value={nome}
                                onChange={e => setNome(e.target.value)}
                                placeholder=" "
                            />
                            <label>Nome terapia</label>
                            {errors.nome && <div className="msg-error">{errors.nome}</div>}
                        </div>

                        <div className="user-box">
                            <input
                                type="text"
                                value={formaFarmaceutica}
                                onChange={e => setFormaFarmaceutica(e.target.value)}
                                placeholder=" "
                            />
                            <label>Forma farmaceutica</label>
                            {errors.formaFarmaceutica && <div className="msg-error">{errors.formaFarmaceutica}</div>}
                        </div>

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

                        <div className="user-box">
                            <textarea
                                value={posologia}
                                onChange={e => setPosologia(e.target.value)}
                                placeholder=" "
                            />
                            <label>Posologia</label>
                            {errors.posologia && <div className="msg-error">{errors.posologia}</div>}
                        </div>

                        <div className="user-box">
                            <input
                                type="text"
                                value={viaDiSomministrazione}
                                onChange={e => setViaDiSomministrazione(e.target.value)}
                                placeholder=" "
                            />
                            <label>Via di somministrazione</label>
                            {errors.viaDiSomministrazione && <div className="msg-error">{errors.viaDiSomministrazione}</div>}
                        </div>

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

                        <div className="user-box">
                            <textarea
                                value={motivo}
                                onChange={e => setMotivo(e.target.value)}
                                placeholder=" "
                            />
                            <label>Motivo</label>
                            {errors.motivo && <div className="msg-error">{errors.motivo}</div>}
                        </div>
                        {serverError && (
                            <div className="user-box">
                                <div className="msg-error">
                                    {serverError}
                                </div>
                            </div>
                        )}
                        <div className="side-boxes-login">
                            <button type="submit" className="button-primary" disabled={submitting}>
                                {submitting ? "Salvataggio..." : "Aggiungi Terapia"}
                            </button>

                            <button type="button" className="button-primary" onClick={() => navigate(-1)}>
                                Annulla
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormTerapia;