import { useState } from "react";
import "./formPatologia.scss";

type Props = {
    petId: number;
    onSuccess?: (data: any) => void;
    onClose?: () => void;
};

// Funzione helper per ottenere la data odierna formattata come "YYYY-MM-DD"
const getOggiFormatted = () => {
    const data = new Date();
    // Normalizziamo a mezzanotte
    data.setHours(0, 0, 0, 0);

    const anno = data.getFullYear();
    const mese = String(data.getMonth() + 1).padStart(2, '0'); // Mese + 1 (0=Gennaio)
    const giorno = String(data.getDate()).padStart(2, '0');

    return `${anno}-${mese}-${giorno}`; // Esempio: "2025-11-27"
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

        // --- Nome ---
        if (!nome.trim()) newErrors.nome = "Il nome è obbligatorio";
        else if (nome.length < 3 || nome.length > 20) newErrors.nome = "Nome 3-20 caratteri";

        // --- Sintomi ---
        if (!sintomi.trim()) newErrors.sintomi = "I sintomi sono obbligatori";
        else if (sintomi.length > 200) newErrors.sintomi = "Max 200 caratteri";

        // --- Diagnosi ---
        if (!diagnosi.trim()) newErrors.diagnosi = "La diagnosi è obbligatoria";
        else if (diagnosi.length > 200) newErrors.diagnosi = "Max 200 caratteri";

        // --- Terapia ---
        if (!terapia.trim()) newErrors.terapia = "La terapia è obbligatoria";
        else if (terapia.length > 200) newErrors.terapia = "Max 200 caratteri";


        // -----------------------------------------------------
        // VALIDAZIONE DATA DI DIAGNOSI
        // -----------------------------------------------------
        if (!dataDiDiagnosi) {
            newErrors.dataDiDiagnosi = "La data della diagnosi è obbligatoria";
        } else {
            const diagnosiDate = new Date(dataDiDiagnosi);
            const oggi = new Date();

            // Normalizziamo: azzeriamo ore/minuti per evitare sfasamenti
            diagnosiDate.setHours(0, 0, 0, 0);
            oggi.setHours(0, 0, 0, 0);

            if (diagnosiDate > oggi) {
                newErrors.dataDiDiagnosi = "La data della diagnosi non può essere nel futuro";
            }
        }


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

            // Reset
            setNome("");
            setDataDiDiagnosi("");
            setSintomi("");
            setDiagnosi("");
            setTerapia("");

            onClose?.();
        } catch (err: any) {
            const errorMessage = err instanceof Error ? err.message : "Errore di rete";
            setServerError(errorMessage);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="aggiunta-Patologia">
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
                                // Imposta il valore massimo sul picker della data per impedire la selezione futura
                                max={getOggiFormatted()}
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
        </div>
    );
};

export default FormPatologia;