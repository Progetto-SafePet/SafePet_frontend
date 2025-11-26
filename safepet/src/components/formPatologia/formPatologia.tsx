import { useState } from "react";
import "./formPatologia.scss";
type Props = {
    petId: number;
    onSuccess?: (data: any) => void;
    onClose?: () => void;
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
        else if (nome.length < 3 || nome.length > 20) newErrors.nome = "Nome 3-20 caratteri";

        if (!dataDiDiagnosi) newErrors.dataDiDiagnosi = "La data della diagnosi è obbligatoria";

        if (!sintomi.trim()) newErrors.sintomi = "I sintomi sono obbligatori";
        else if (sintomi.length > 200) newErrors.sintomi = "Max 200 caratteri";

        if (!diagnosi.trim()) newErrors.diagnosi = "La diagnosi è obbligatoria";
        else if (diagnosi.length > 200) newErrors.diagnosi = "Max 200 caratteri";

        if (!terapia.trim()) newErrors.terapia = "La terapia è obbligatoria";
        else if (terapia.length > 200) newErrors.terapia = "Max 200 caratteri";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        setServerError(null);

        const requestBody = {
            nome,
            dataDiDiagnosi,
            sintomiOsservati: sintomi,
            diagnosi,
            terapiaAssociata: terapia
        };

        try {
            const res = await fetch(`http://localhost:8080/gestioneCartellaClinica/aggiungiPatologia/${petId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {})
                },
                body: JSON.stringify(requestBody)
            });

            if (!res.ok) {
                const text = await res.text();
                setServerError(text || "Errore dal server");
                setSubmitting(false);
                return;
            }

            const data = await res.json();
            onSuccess?.(data);

            setNome("");
            setDataDiDiagnosi("");
            setSintomi("");
            setDiagnosi("");
            setTerapia("");

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
                <h2>Registra nuova patologia</h2>
                <form onSubmit={handleSubmit}>
                    <div className="user-box">
                        <input
                            type="text"
                            value={nome}
                            onChange={e => setNome(e.target.value)}
                            placeholder=" "
                        />
                        <label>Nome</label>
                        {errors.nome && <div className="msg-error">{errors.nome}</div>}
                    </div>

                    <div className="user-box">
                        <input
                            type="date"
                            value={dataDiDiagnosi}
                            onChange={e => setDataDiDiagnosi(e.target.value)}
                            placeholder=" "
                        />
                        <label>Data diagnosi</label>
                        {errors.dataDiDiagnosi && <div className="msg-error">{errors.dataDiDiagnosi}</div>}
                    </div>

                    <div className="user-box">
                        <textarea
                            value={sintomi}
                            onChange={e => setSintomi(e.target.value)}
                            placeholder=" "
                        />
                        <label>Sintomi osservati</label>
                        {errors.sintomi && <div className="msg-error">{errors.sintomi}</div>}
                    </div>

                    <div className="user-box">
                        <textarea
                            value={diagnosi}
                            onChange={e => setDiagnosi(e.target.value)}
                            placeholder=" "
                        />
                        <label>Diagnosi</label>
                        {errors.diagnosi && <div className="msg-error">{errors.diagnosi}</div>}
                    </div>

                    <div className="user-box">
                        <input
                            type="text"
                            value={terapia}
                            onChange={e => setTerapia(e.target.value)}
                            placeholder=" "
                        />
                        <label>Terapia associata</label>
                        {errors.terapia && <div className="msg-error">{errors.terapia}</div>}
                    </div>

                    {serverError && <div className="msg-error">{serverError}</div>}

                    <div className="side-boxes-login">
                        <button type="submit" className="button-primary-Patologia" disabled={submitting}>
                            {submitting ? "Salvataggio..." : "Salva patologia"}
                        </button>
                        <button type="button" className="button-primary-Patologia" onClick={onClose}>Chiudi</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default FormPatologia;