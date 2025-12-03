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

const FormVisitaMedica: React.FC<Props> = ({ petId, onSuccess, onClose }) => {
    const [nome, setNome] = useState("");
    const [descrizione, setDescrizione] = useState("");
    const [data, setData] = useState("");
    const [referto, setReferto] = useState<File | null>(null);

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

        // Nome visita: 3–20 caratteri
        if (!nome.trim()) newErrors.nome = "Il titolo della visita è obbligatorio";
        else if (nome.length < 3 || nome.length > 20)
            newErrors.nome = "Il nome deve essere tra 3 e 20 caratteri";

        // Descrizione: max 300 char
        if (descrizione.length > 300)
            newErrors.descrizione = "La descrizione non può superare i 300 caratteri";

        // Data della visita: obbligatoria e non futura
        if (!data) newErrors.data = "La data è obbligatoria";
        else {
            const d = new Date(data);
            const today = new Date();
            d.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            if (d > today)
                newErrors.data = "La data della visita non può essere futura";
        }

        // Referto (se presente) deve essere PDF
        if (referto && referto.type !== "application/pdf") {
            newErrors.refero = "Il referto deve essere un file PDF";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // SUBMIT DELLA VISITA
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            if (errors.petId)
                setServerError("ID Paziente non valido. Impossibile registrare la visita.");
            return;
        }

        setSubmitting(true);
        setServerError(null);

        const formData = new FormData();
        formData.append("nome", nome);
        formData.append("data", data);

        if (descrizione.trim() !== "") {
            formData.append("descrizione", descrizione);
        }

        if (referto) {
            formData.append("referto", referto);
        }

        try {
            const res = await fetch(
                `/gestioneCartellaClinica/creaVisitaMedica/${petId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${TOKEN}`
                    },
                    body: formData
                }
            );

            if (!res.ok) {
                const text = await res.text();
                let errorMessage = text || "Errore dal server";

                try {
                    const json = JSON.parse(text);
                    errorMessage = json.detail || json.title || errorMessage;
                } catch { }

                setServerError(errorMessage);
                setSubmitting(false);
                return;
            }

            // Nessun console.log, nessuna redirect
            onSuccess?.();
            onClose?.();

            // Reset (opzionale ma utile)
            setNome("");
            setDescrizione("");
            setData("");
            setReferto(null);

        } catch (err: any) {
            setServerError(err.message);
        } finally {
            setSubmitting(false);
        }
        console.log("Visita medica registrata con successo!");
    };

    return (
        <div className="form-RecordMedico">
            <div className="modal-overlay">
                <div className="modal-box">
                    <h2>Registra nuova visita medica</h2>

                    <form onSubmit={handleSubmit}>

                        {/* Nome visita */}
                        <div className="user-box">
                            <input
                                type="text"
                                value={nome}
                                onChange={e => setNome(e.target.value)}
                                placeholder=" "
                                maxLength={20}
                            />
                            <label>Nome</label>
                            {errors.nome && <div className="msg-error">{errors.nome}</div>}
                        </div>

                        {/* Descrizione */}
                        <div className="user-box">
                            <textarea
                                value={descrizione}
                                onChange={e => setDescrizione(e.target.value)}
                                placeholder=" "
                                maxLength={300}
                                rows={5}
                            />
                            <label>Descrizione (max 300 caratteri)</label>
                            {errors.descrizione && (
                                <div className="msg-error">{errors.descrizione}</div>
                            )}
                        </div>

                        {/* Data */}
                        <div className="user-box">
                            <input
                                type="date"
                                value={data}
                                onChange={e => setData(e.target.value)}
                                max={getToday()}
                                placeholder=" "
                            />
                            <label>Data visita</label>
                            {errors.data && (
                                <div className="msg-error">{errors.data}</div>
                            )}
                        </div>

                        {/* Referto PDF */}
                        <div className="user-box">
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) =>
                                    setReferto(e.target.files ? e.target.files[0] : null)
                                }
                            />
                            <label className="file-label">Referto (PDF, opzionale)</label>
                        </div>

                        {/* Errori globali */}
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
                                {submitting ? "Salvataggio..." : "Salva visita"}
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

export default FormVisitaMedica;
