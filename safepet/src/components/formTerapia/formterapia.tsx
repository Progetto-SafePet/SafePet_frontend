import React, { useState } from "react";

interface AggiungiTerapiaFormProps {
    petId: number;
    onSuccess?: (data: any) => void;
    onClose?: () => void;
}

interface TerapiaForm {
    nome: string;
    formaFarmaceutica: string;
    dosaggio: string;
    posologia: string;
    viaDiSomministrazione: string;
    durata: string;
    frequenza: string;
    motivo: string;
}

interface ErrorMap {
    [key: string]: string | null;
}

const AggiungiTerapiaForm: React.FC<AggiungiTerapiaFormProps> = ({ petId, onSuccess, onClose }) => {
    const [form, setForm] = useState<TerapiaForm>({
        nome: "",
        formaFarmaceutica: "",
        dosaggio: "",
        posologia: "",
        viaDiSomministrazione: "",
        durata: "",
        frequenza: "",
        motivo: ""
    });

    const [errors, setErrors] = useState<ErrorMap>({});
    const [serverError, setServerError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: null });
    };

    const validate = () => {
        const newErrors: ErrorMap = {};

        if (!form.nome.trim()) newErrors.nome = "Il nome è obbligatorio";
        if (!form.formaFarmaceutica.trim()) newErrors.formaFarmaceutica = "La forma farmaceutica è obbligatoria";
        if (!form.dosaggio.trim()) newErrors.dosaggio = "Il dosaggio è obbligatorio";
        if (!form.posologia.trim()) newErrors.posologia = "La posologia è obbligatoria";
        if (!form.viaDiSomministrazione.trim()) newErrors.viaDiSomministrazione = "La via di somministrazione è obbligatoria";
        if (!form.durata.trim()) newErrors.durata = "La durata è obbligatoria";
        if (!form.frequenza.trim()) newErrors.frequenza = "La frequenza è obbligatoria";
        if (!form.motivo.trim()) newErrors.motivo = "Il motivo è obbligatorio";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);
        setServerError(null);

        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_BASE_URL}/aggiungiTerapia/${petId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify(form)
                }
            );

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Errore durante l'invio");
            }

            const data = await res.json();
            onSuccess?.(data);

            // Reset form
            setForm({
                nome: "",
                formaFarmaceutica: "",
                dosaggio: "",
                posologia: "",
                viaDiSomministrazione: "",
                durata: "",
                frequenza: "",
                motivo: ""
            });

            onClose?.();
        } catch (err: any) {
            setServerError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className="form" onSubmit={handleSubmit}>
            <h2>Aggiungi Terapia</h2>

            {serverError && (
                <div className="server-error">{serverError}</div>
            )}

            {/* Nome */}
            <div className="user-box">
                <input
                    type="text"
                    name="nome"
                    value={form.nome}
                    onChange={handleChange}
                    placeholder=" "
                />
                <label>Nome terapia</label>
                {errors.nome && <div className="msg-error">{errors.nome}</div>}
            </div>

            {/* Forma farmaceutica */}
            <div className="user-box">
                <input
                    type="text"
                    name="formaFarmaceutica"
                    value={form.formaFarmaceutica}
                    onChange={handleChange}
                    placeholder=" "
                />
                <label>Forma farmaceutica</label>
                {errors.formaFarmaceutica && <div className="msg-error">{errors.formaFarmaceutica}</div>}
            </div>

            {/* Dosaggio */}
            <div className="user-box">
                <input
                    type="text"
                    name="dosaggio"
                    value={form.dosaggio}
                    onChange={handleChange}
                    placeholder=" "
                />
                <label>Dosaggio</label>
                {errors.dosaggio && <div className="msg-error">{errors.dosaggio}</div>}
            </div>

            {/* Posologia */}
            <div className="user-box">
                <textarea
                    name="posologia"
                    value={form.posologia}
                    onChange={handleChange}
                    placeholder=" "
                />
                <label>Posologia</label>
                {errors.posologia && <div className="msg-error">{errors.posologia}</div>}
            </div>

            {/* Via di somministrazione */}
            <div className="user-box">
                <input
                    type="text"
                    name="viaDiSomministrazione"
                    value={form.viaDiSomministrazione}
                    onChange={handleChange}
                    placeholder=" "
                />
                <label>Via di somministrazione</label>
                {errors.viaDiSomministrazione && <div className="msg-error">{errors.viaDiSomministrazione}</div>}
            </div>

            {/* Durata */}
            <div className="user-box">
                <input
                    type="text"
                    name="durata"
                    value={form.durata}
                    onChange={handleChange}
                    placeholder=" "
                />
                <label>Durata</label>
                {errors.durata && <div className="msg-error">{errors.durata}</div>}
            </div>

            {/* Frequenza */}
            <div className="user-box">
                <input
                    type="text"
                    name="frequenza"
                    value={form.frequenza}
                    onChange={handleChange}
                    placeholder=" "
                />
                <label>Frequenza</label>
                {errors.frequenza && <div className="msg-error">{errors.frequenza}</div>}
            </div>

            {/* Motivo */}
            <div className="user-box">
                <textarea
                    name="motivo"
                    value={form.motivo}
                    onChange={handleChange}
                    placeholder=" "
                />
                <label>Motivo</label>
                {errors.motivo && <div className="msg-error">{errors.motivo}</div>}
            </div>

            <button disabled={submitting} type="submit" className="btn-primary">
                {submitting ? "Invio..." : "Aggiungi Terapia"}
            </button>
        </form>
    );
};

export default AggiungiTerapiaForm;
