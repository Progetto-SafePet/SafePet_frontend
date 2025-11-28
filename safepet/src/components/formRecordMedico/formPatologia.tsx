import { useState } from "react";
import "../formRecordMedico/form.scss";

type Props = {
    petId: number;
    onSuccess?: () => void;
    onClose?: () => void;
};

// Helper data odierna
const getOggiFormatted = () => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d.toISOString().split("T")[0];
};

const FormPatologia: React.FC<Props> = ({ petId, onSuccess, onClose }) => {
    const [nome, setNome] = useState("");
    const [dataDiDiagnosi, setDataDiDiagnosi] = useState("");
    const [sintomi, setSintomi] = useState("");
    const [diagnosi, setDiagnosi] = useState("");
    const [terapia, setTerapia] = useState("");

    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const TOKEN = localStorage.getItem("token");

    const validate = () => {
        const newErrors: { [key: string]: string } = {};

        if (!nome.trim()) newErrors.nome = "Il nome è obbligatorio";

        if (!sintomi.trim()) newErrors.sintomi = "I sintomi sono obbligatori";

        if (!diagnosi.trim()) newErrors.diagnosi = "La diagnosi è obbligatoria";

        if (!terapia.trim()) newErrors.terapia = "La terapia è obbligatoria";

        if (!dataDiDiagnosi) {
            newErrors.dataDiDiagnosi = "La data è obbligatoria";
        } else {
            const date = new Date(dataDiDiagnosi);
            const today = new Date();
            date.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            if (date > today)
                newErrors.dataDiDiagnosi = "La data non può essere futura";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        setServerError(null);

        const payload = {
            nome,
            dataDiDiagnosi,
            sintomiOsservati: sintomi,
            diagnosi,
            terapiaAssociata: terapia
        };

        try {
            const res = await fetch(
                `http://localhost:8080/gestioneCartellaClinica/aggiungiPatologia/${petId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${TOKEN}`
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (!res.ok) {
                setServerError(await res.text());
                setSubmitting(false);
                return;
            }

            onSuccess?.();
            onClose?.();

        } catch (err: any) {
            setServerError(err.message);
        } finally {
            setSubmitting(false);
        }
        console.log("Patologia registrata con successo!");
    };

    return (
        <div className="form-RecordMedico">
            <div className="modal-overlay">
                <div className="modal-box">
                    <h2>Registra nuova patologia</h2>

                    <form onSubmit={handleSubmit}>
                        <div className="user-box">
                            <input type="text" value={nome}
                                   onChange={e => setNome(e.target.value)} placeholder=" " />
                            <label>Nome</label>
                            {errors.nome && <div className="msg-error">{errors.nome}</div>}
                        </div>

                        <div className="user-box">
                            <input type="date" value={dataDiDiagnosi}
                                   max={getOggiFormatted()}
                                   onChange={e => setDataDiDiagnosi(e.target.value)} placeholder=" " />
                            <label>Data diagnosi</label>
                            {errors.dataDiDiagnosi && <div className="msg-error">{errors.dataDiDiagnosi}</div>}
                        </div>

                        <div className="user-box">
                            <textarea value={sintomi}
                                      onChange={e => setSintomi(e.target.value)} placeholder=" " />
                            <label>Sintomi osservati</label>
                            {errors.sintomi && <div className="msg-error">{errors.sintomi}</div>}
                        </div>

                        <div className="user-box">
                            <textarea value={diagnosi}
                                      onChange={e => setDiagnosi(e.target.value)} placeholder=" " />
                            <label>Diagnosi</label>
                            {errors.diagnosi && <div className="msg-error">{errors.diagnosi}</div>}
                        </div>

                        <div className="user-box">
                            <input type="text" value={terapia}
                                   onChange={e => setTerapia(e.target.value)} placeholder=" " />
                            <label>Terapia associata</label>
                            {errors.terapia && <div className="msg-error">{errors.terapia}</div>}
                        </div>

                        {serverError && <div className="msg-error">{serverError}</div>}

                        <div className="side-boxes-login">
                            <button type="submit"
                                    className="button-primary"
                                    disabled={submitting}>
                                {submitting ? "Salvataggio..." : "Salva patologia"}
                            </button>

                            <button type="button"
                                    className="button-primary"
                                    onClick={onClose}>
                                Chiudi
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
};

export default FormPatologia;
