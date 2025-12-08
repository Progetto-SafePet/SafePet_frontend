import React, {useState, useRef, useEffect} from "react";
import "../css/AnalisiDermatologica.scss";
import Title from "../components/Title/Title";



type RisultatoDiagnosiDTO = {
    classe: string;
    confidence: number;
};

function AnalisiDermatologica() {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [result, setResult] = useState<RisultatoDiagnosiDTO | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const BACKEND_URL = "http://localhost:8080/analisiDermatologica/analizza";

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    const isSupported = (f: File) =>
        ["image/jpeg", "image/png"].includes(f.type);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        setError(null);
        setResult(null);

        if (!f) {
            setFile(null);
            setPreviewUrl(null);
            return;
        }

        if (!isSupported(f)) {
            setError("Formato non supportato. Carica un'immagine .jpg o .png.");
            setFile(null);
            setPreviewUrl(null);
            return;
        }

        setFile(f);
        const url = URL.createObjectURL(f);
        setPreviewUrl(url);
    };

    const reset = () => {
        setFile(null);
        setPreviewUrl(null);
        setResult(null);
        setError(null);
        if (inputRef.current) inputRef.current.value = "";
    };

    const analyze = async () => {
        if (!file) {
            setError("Seleziona un'immagine prima di avviare l'analisi.");
            return;
        }

        // Controllo lato client sulla dimensione (10 MB) per anticipare l'errore del backend
        const MAX_SIZE_BYTES = 10 * 1024 * 1024;
        if (file.size > MAX_SIZE_BYTES) {
            setError("L'immagine supera la dimensione massima consentita (10 MB).");
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        const formData = new FormData();
        formData.append("image", file);

        // Recupera il token
        const token = localStorage.getItem("token");

        try {
            const res = await fetch(BACKEND_URL, {
                method: "POST",
                body: formData,
                headers: token
                    ? { Authorization: `Bearer ${token}` }
                    : undefined,
            });

            if (res.status === 401) {
                throw new Error("Non sei autenticato. Effettua il login per continuare.");
            }
            if (res.status === 403) {
                throw new Error("Accesso non autorizzato. Questo servizio è riservato ai proprietari.");
            }
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text || "Errore durante l'analisi. Riprova più tardi.");
            }

            const data = (await res.json()) as RisultatoDiagnosiDTO;

            if (!data || typeof data.classe !== "string" || typeof data.confidence !== "number") {
                throw new Error("Risposta non valida dal servizio di analisi.");
            }

            setResult(data);
        } catch (err: any) {
            setError(err.message || "Si è verificato un errore inatteso.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="analisi-dermatologica-page">
            <Title text="Analisi Dermatologica"></Title>
            <div className="ad-header">
                <p className="ad-subtitle">
                    SkinDetector analizza le foto della cute del tuo animale, individua eventuali problemi dermatologici e fornisce un primo riscontro diagnostico rapido e intuitivo, per un controllo semplice e immediato.                </p>
            </div>

            <div className="ad-upload">
                <input
                    ref={inputRef}
                    type="file"
                    accept="image/jpeg,image/png"
                    className="ad-file-input"
                    onChange={handleFileChange}
                />
                {previewUrl && (
                    <img
                        src={previewUrl}
                        alt="Anteprima immagine caricata"
                        className="ad-preview"
                    />
                )}
            </div>

            <div className="ad-actions">
                <button
                    type="button"
                    className="ad-btn ad-btn-primary"
                    onClick={analyze}
                    disabled={!file || loading}
                >
                    {loading ? "Analisi in corso..." : "Avvia analisi"}
                </button>
                <button
                    type="button"
                    className="ad-btn ad-btn-ghost"
                    onClick={reset}
                    disabled={loading && !file}
                >
                    Reset
                </button>
            </div>

            {error && (
                <div className="ad-alert ad-alert-error" role="alert">
                    {error}
                </div>
            )}

            {result && (
                <div className="ad-result">
                    <h2 className="ad-result-title">Risultato</h2>
                    <div className="ad-result-grid">
                        <div className="ad-result-item">
                            <span className="ad-result-label">Classe:</span>
                            <span className="ad-result-value">{result.classe}</span>
                        </div>
                        <div className="ad-result-item">
                            <span className="ad-result-label">Confidence:</span>
                            <span className="ad-result-value">
                {(result.confidence * 100).toFixed(2)}%
              </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AnalisiDermatologica;
