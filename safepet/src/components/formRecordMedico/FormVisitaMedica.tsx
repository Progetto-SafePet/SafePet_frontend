import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../formRecordMedico/form.scss";

const FormVisitaMedica: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const petId = id ? Number(id) : undefined;
    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [descrizione, setDescrizione] = useState("");
    const [data, setData] = useState("");
    const [referto, setReferto] = useState<File | null>(null);
    const [error, setErrors] = useState<{ [key: string]: string }>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const TOKEN = localStorage.getItem("token");

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!petId || isNaN(petId) || petId <= 0) {
            newErrors.petId = "ID paziente non valido o mancante.";
        }

        if (!nome.trim()) {
            newErrors.nome = "Il titolo della visita è obbligatorio";
        } else if (nome.length < 3 || nome.length > 20) {
            newErrors.nome = "La lunghezza del nome deve essere compresa tra i 3 e i 20 caratteri";
        }

        if (descrizione.length > 300) {
            newErrors.descrizione = "La descrizione non può superare i 300 caratteri";
        }

        if (!data.trim()) {
            newErrors.data = "La data della visita è obbligatoria";
        } else {
            const today = new Date();
            const selectedDate = new Date(data);

            if(selectedDate > today) {
                newErrors.data = "La data della visita non può essere futura.";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const creaVisitaMedica = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            if (error.petId) {
                setServerError("ID Paziente non valido. Impossibile salvare la visita.");
            }
            return;
        }

        setSubmitting(true);
        setServerError(null);

        const formData = new FormData();
        formData.append("nome", nome);
        if (descrizione.trim() !== "") {
            formData.append("descrizione", descrizione);
        }
        formData.append("data", data);
        if(referto) {
            formData.append("referto", referto);
        }

        try {
            const response = await fetch(
                `http://localhost:8080/gestioneCartellaClinica/creaVisitaMedica/${petId}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${TOKEN}`,
                    },
                    body: formData,
                }
            );

            if (!response.ok) {
                const text = await response.text();
                let errorMessage = text || "Errore dal server";
                try {
                    const errorJson = JSON.parse(text);
                    errorMessage = errorJson.detail || errorJson.title || errorMessage;
                } catch {}

                setServerError(errorMessage);
                setSubmitting(false);
                return;
            }

            alert("Visita Medica registrata con successo!");

            setNome("");
            setDescrizione("");
            setData("");
            setReferto(null);

            navigate(`/dettagli/${petId}`);

        } catch (err: any) {
            const errorMessage = err instanceof Error ? err.message : "Errore di rete";
            setServerError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    if (!petId || isNaN(petId) || petId <= 0) {
        return (
            <div className="visita-medica">
                <div className="modal-overlay">
                    <div className="modal-box error-state">
                        <h2>Errore Critico</h2>
                        <div className="msg-error">
                            ID Paziente non fornito o non valido. Impossibile registrare la visita.
                        </div>
                        <div className="side-boxes-login">
                            <button type="button" className="button-primary" onClick={() => navigate(-1)}>Torna indietro</button>
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
                    <h2>Registra nuova Visita Medica (Pet ID: {petId})</h2>
                    <form onSubmit={creaVisitaMedica}>
                        <div className="user-box">
                            <input
                                type="text"
                                value={nome}
                                onChange={e => setNome(e.target.value)}
                                maxLength={20}
                                placeholder=" "
                            />
                            <label>Nome</label>
                            {error.nome && <div className="msg-error">{error.nome}</div>}
                        </div>

                        <div className="user-box">
                            <textarea
                                id="descrizione"
                                value={descrizione}
                                onChange={(e) => setDescrizione(e.target.value)}
                                rows={5}
                                maxLength={300}
                                placeholder=" "
                            />
                            <label>Descrizione</label>
                            {error.descrizione && <div className="msg-error">{error.descrizione}</div>}
                        </div>

                        <div className="user-box">
                            <input
                                type="date"
                                value={data}
                                onChange={e => setData(e.target.value)}
                                placeholder=" "
                            />
                            <label>Data Visita</label>
                            {error.data && <div className="msg-error">{error.data}</div>}
                        </div>

                        <div className="user-box">
                            <input
                                type="file"
                                accept="application/pdf"
                                onChange={(e) => setReferto(e.target.files ? e.target.files[0] : null)}
                            />
                            <label className="file-label">Referto (PDF, opzionale)</label>
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
                                {submitting ? "Salvataggio..." : "Salva Visita Medica"}
                            </button>
                            <button type="button" className="button-primary" onClick={() => navigate(-1)}>Annulla</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default FormVisitaMedica;