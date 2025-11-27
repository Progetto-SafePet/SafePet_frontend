import React, { useState } from "react";
import "./formVisitaMedica.scss";
type Props = {
    petId: number;
    onSuccess?: (data: any) => void;
    onClose?: () => void;
};

const FormVisitaMedica: React.FC<Props> = ({ petId, onSuccess, onClose }) => {
    const [nome, setNome] = useState("");
    const [descrizione, setDescrizione] = useState("");
    const [data, setData] = useState("");
    const [referto, setReferto] = useState(null);
    const [error, setErrors] = useState<{ [key: string]: string }>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const TOKEN = localStorage.getItem("token");

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

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
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const creaVisitaMedica = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        setServerError(null);

        const formData = new FormData();
        formData.append("nome", nome);
        if (descrizione.trim() !== "") {
            formData.append("descrizione", descrizione);
        } //descrizione è opzionale
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
            setServerError(text || "Errore dal server");
            setSubmitting(false);
            return;
        }

        const data = await response.json();
        onSuccess?.(data);

            setNome("");
            setDescrizione("");
            setData("");
            setReferto(null);

        onClose?.();
    } catch (err: any) {
        setServerError(err.message || "Errore di rete");
    } finally {
        setSubmitting(false);
    }
};

return (
    <div className="visita-medica">
        <div className="modal-overlay">
            <div className="modal-box">
                <h2>Registra nuova Visita Medica</h2>
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
                            onChange={(e) => setReferto(e.target.files[0])}
                        />
                    </div>

                    {serverError && (
                            <div className="user-box">
                                <div className="msg-error">
                                    {serverError}
                                </div>
                            </div>
                    )}

                    <div className="side-boxes-login">
                        <button type="submit" className="button-primary-VisitaMedica" disabled={submitting}>
                            {submitting ? "Salvataggio..." : "Salva Visita Medica"}
                        </button>
                        <button type="button" className="button-primary-VisitaMedica" onClick={onClose}>Chiudi</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
);
};

export default FormVisitaMedica;