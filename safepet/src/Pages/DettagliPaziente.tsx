import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Title from "../components/Title/Title";
import "../css/dettagli.scss";

const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return '-';
    try {
        return dateString.split('T')[0];
    } catch (e) {
        return String(dateString);
    }
};

type Nota = {
    idNota: number;
    titolo: string;
    descrizione: string;
    idPet: number;
    nomePet: string;
    idProprietario: number;
    nomeCompletoProprietario: string;
};

type VisitaMedicaResponseDTO = {
    visitaMedicaId: number;
    nome: string;
    petId: number;
    veterinarioId: number;
    descrizione?: string;
    nomePet?: string;
    data: string;
    isPresentReferto: boolean;
    nomeCompletoVeterinario: string;
};

type PatologiaResponseDTO = {
    patologiaId: number;
    nome: string;
    petId: number;
    veterinarioId: number;
    dataDiDiagnosi: string;
    sintomiOsservati: string;
    diagnosi: string;
    terapiaAssociata: string;
    nomeVeterinarioCompleto: string;
};

type TerapiaResponseDTO = {
    terapiaId: number;
    nome: string;
    petId: number;
    veterinarioId: number;
    formaFarmaceutica: string;
    dosaggio: string;
    posologia: string;
    viaDiSomministrazione: string;
    durata: string;
    frequenza: string;
    motivo: string;
    nomeVeterinarioCompleto: string;
};

type VaccinazioneResponseDTO = {
    vaccinazioneId: number;
    nomeVaccino: string;
    petId: number;
    veterinarioId: number;
    tipologia: string;
    dataDiSomministrazione: string;
    doseSomministrata: number;
    viaDiSomministrazione: string;
    effettiCollaterali: string;
    richiamoPrevisto: string;
    nomeVeterinarioCompleto: string;
};

type CartellaClinica = {
    visiteMediche: VisitaMedicaResponseDTO[];
    patologie: PatologiaResponseDTO[];
    terapie: TerapiaResponseDTO[];
    vaccinazioni: VaccinazioneResponseDTO[];
};

type DettagliResponseDTO = {
    id: number;
    nome: string;
    specie: string;
    razza?: string;
    sesso: string;
    dataNascita: string;
    proprietarioCompleto: string;
    peso?: number;
    coloreMantello?: string;
    microchip?: string;
    sterilizzato?: boolean;
    fotoBase64?: string;
    noteProprietario: Nota[];
};


const DettagliPaziente: React.FC = () => {
    const [pet, setDettagli] = useState<DettagliResponseDTO | null>(null);
    const [clinicalRecord, setClinicalRecord] = useState<CartellaClinica | null>(null);
    const [loadingError, setLoadingError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"vaccinazioni" | "visite" | "patologie" | "terapie">("vaccinazioni");
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!id || !token) {
            setLoadingError("ID paziente o token di autorizzazione mancante.");
            return;
        }

        const fetchPaziente = async () => {
            try {
                const response = await fetch(`http://localhost:8080/gestionePaziente/dettagli/${id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setDettagli(data);
                } else {
                    console.error("Errore durante il recupero del paziente. Stato:", response.status);
                }
            } catch (error) {
                console.error("Errore di connessione fetchPaziente:", error);
            }
        };
        const fetchCartellaClinica = async () => {
            setLoadingError(null);
            try {
                const response = await fetch(`http://localhost:8080/gestioneCartellaClinica/cartellaClinica/${id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    const data: CartellaClinica = await response.json();
                    setClinicalRecord(data);
                    console.log("Dati cartella clinica recuperati con successo:", data);
                } else {
                    const errorText = await response.text();
                    console.error(`Errore durante il recupero della cartella clinica. Stato HTTP: ${response.status}`);
                    console.error("Dettagli dell'errore dal server:", errorText);
                    setLoadingError(`Impossibile caricare la cartella clinica. Errore ${response.status}. Controlla la console per i dettagli.`);
                }
            } catch (error) {
                console.error("Errore di connessione fetchCartellaClinica (Rete/CORS):", error);
                setLoadingError("Errore di rete o server non raggiungibile. Controlla che il backend sia attivo.");
            }
        };

        fetchPaziente();
        fetchCartellaClinica();
    }, [id]);

    const handleNavigateToForm = () => {
        if (!id) return;

        let basePath = "";
        switch (activeTab) {
            case "vaccinazioni":
                basePath = "/vaccinazione";
                break;
            case "visite":
                basePath = "/visitaMedica";
                break;
            case "patologie":
                basePath = "/patologia";
                break;
            case "terapie":
                basePath = "/terapia";
                break;
            default:
                return;
        }

        navigate(`${basePath}/${id}`);
    };

    const renderTabContent = () => {
        if (loadingError) {
            return <div className="error-message">ERRORE DI CARICAMENTO: {loadingError}</div>;
        }

        if (!clinicalRecord) {
            return <div>Caricamento dati clinici...</div>;
        }

        switch (activeTab) {
            case "vaccinazioni":
                const vaccinazioni = clinicalRecord.vaccinazioni;
                return (
                    <>
                        {vaccinazioni.length > 0 ? (
                            vaccinazioni.map((v) => (
                                <div key={v.vaccinazioneId} className="clinical-item">
                                    <h4>{v.nomeVaccino} ({v.tipologia})</h4>
                                    <p><strong>Data Somministrazione:</strong> {formatDate(v.dataDiSomministrazione)}</p>
                                    <p><strong>Dose:</strong> {v.doseSomministrata} | <strong>Via:</strong> {v.viaDiSomministrazione}</p>
                                    <p><strong>Effetti Collaterali:</strong> {v.effettiCollaterali || 'Nessuno'}</p>
                                    <p><strong>Richiamo Previsto:</strong> {formatDate(v.richiamoPrevisto)}</p>
                                    <p className="veterinario-info">Registrato da: {v.nomeVeterinarioCompleto}</p>
                                    <hr />
                                </div>
                            ))
                        ) : (
                            <h4>Nessuna vaccinazione registrata</h4>
                        )}
                    </>
                );
            case "visite":
                const visite = clinicalRecord.visiteMediche;
                return (
                    <>
                        {visite.length > 0 ? (
                            visite.map((v) => (
                                <div key={v.visitaMedicaId} className="clinical-item">
                                    <h4>Visita: {v.nome}</h4>
                                    <p><strong>Data:</strong> {formatDate(v.data)}</p>
                                    <p><strong>Descrizione:</strong> {v.descrizione || 'Non disponibile'}</p>
                                    <p><strong>Referto:</strong> {v.isPresentReferto ? "Disponibile" : "Non presente"}</p>
                                    <p className="veterinario-info">Effettuata da: {v.nomeCompletoVeterinario}</p>
                                    <hr />
                                </div>
                            ))
                        ) : (
                            <h4>Nessuna visita registrata</h4>
                        )}
                    </>
                );
            case "patologie":
                const patologie = clinicalRecord.patologie;
                return (
                    <>
                        {patologie.length > 0 ? (
                            patologie.map((p) => (
                                <div key={p.patologiaId} className="clinical-item">
                                    <h4>Patologia: {p.nome}</h4>
                                    <p><strong>Data Diagnosi:</strong> {formatDate(p.dataDiDiagnosi)}</p>
                                    <p><strong>Diagnosi:</strong> {p.diagnosi}</p>
                                    <p><strong>Sintomi Osservati:</strong> {p.sintomiOsservati}</p>
                                    <p><strong>Terapia Associata:</strong> {p.terapiaAssociata}</p>
                                    <p className="veterinario-info">Diagnosticata da: {p.nomeVeterinarioCompleto}</p>
                                    <hr />
                                </div>
                            ))
                        ) : (
                            <h4>Nessuna patologia registrata</h4>
                        )}
                    </>
                );
            case "terapie":
                const terapie = clinicalRecord.terapie;
                return (
                    <>
                        {terapie.length > 0 ? (
                            terapie.map((t) => (
                                <div key={t.terapiaId} className="clinical-item">
                                    <h4>Terapia: {t.nome}</h4>
                                    <p><strong>Motivo:</strong> {t.motivo}</p>
                                    <p><strong>Dosaggio/Frequenza:</strong> {t.dosaggio} ({t.frequenza})</p>
                                    <p><strong>Forma/Via:</strong> {t.formaFarmaceutica}, {t.viaDiSomministrazione}</p>
                                    <p><strong>Durata:</strong> {t.durata}</p>
                                    <p className="veterinario-info">Prescritta da: {t.nomeVeterinarioCompleto}</p>
                                    <hr />
                                </div>
                            ))
                        ) : (
                            <h4>Nessuna terapia registrata</h4>
                        )}
                    </>
                );
            default:
                return null;
        }
    };

    if (!pet) return <div>Caricamento paziente...</div>;

    return (
        <div className="page-container">
            <Title text="Dettagli paziente" />

            <div className="photo-container">
                {pet.fotoBase64 ? (
                    <img src={`data:image/jpeg;base64,${pet.fotoBase64}`} alt="Foto del pet" />
                ) : (
                    <img src="../imgs/vetPlaceholder.jpg" alt="Foto del pet" />
                )}
                <strong>{pet.nome}</strong>
            </div>

            <div className="dettagli-card">
                <div className="profile-section">
                    <div className="info-section">
                        <div className="info-block">
                            <strong>Informazioni Anagrafiche</strong>
                            <p><strong>Nome:</strong> {pet.nome}</p>
                            <p><strong>Specie:</strong> {pet.specie}</p>
                            <p><strong>Razza:</strong> {pet.razza || "-"}</p>
                            <p><strong>Sesso:</strong> {pet.sesso}</p>
                            <p><strong>Data Nascita:</strong> {pet.dataNascita}</p>
                            <p><strong>Proprietario:</strong> {pet.proprietarioCompleto}</p>
                        </div>

                        <div className="info-block">
                            <strong>Informazioni Fisiche</strong>
                            <p><strong>Peso:</strong> {pet.peso ?? "-"} kg</p>
                            <p><strong>Colore Mantello:</strong> {pet.coloreMantello || "-"}</p>
                            <p><strong>Microchip:</strong> {pet.microchip || "-"}</p>
                            <p><strong>Sterilizzato:</strong> {pet.sterilizzato ? "Sì" : "No"}</p>
                        </div>
                    </div>
                    <div className="cartella-clinica">
                        <div className="cartella-header">
                            <h3>Cartella Clinica</h3>
                        </div>

                        <div className="tabs-and-actions">
                            <div className="cartella-tabs">
                                <ul>
                                    <li className={activeTab === "vaccinazioni" ? "active" : ""} onClick={() => setActiveTab("vaccinazioni")}>Vaccinazioni</li>
                                    <li className={activeTab === "visite" ? "active" : ""} onClick={() => setActiveTab("visite")}>Visite</li>
                                    <li className={activeTab === "patologie" ? "active" : ""} onClick={() => setActiveTab("patologie")}>Patologie</li>
                                    <li className={activeTab === "terapie" ? "active" : ""} onClick={() => setActiveTab("terapie")}>Terapie</li>
                                </ul>
                            </div>
                            <button onClick={handleNavigateToForm}>
                                Aggiungi nuova {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
                            </button>
                        </div>

                        <div className="cartella-content">
                            {renderTabContent()}
                        </div>
                    </div>
                    <div className="note-proprietario-section">
                        <div className="cartella-header">
                            <h3>Note Proprietario</h3>
                        </div>
                        {pet?.noteProprietario?.length ? (
                            pet.noteProprietario.map((nota) => (
                                <div key={nota.idNota} className="nota-item">
                                    <h4>{nota.titolo}</h4>
                                    <p>{nota.descrizione}</p>
                                    <small>Pet: {nota.nomePet} | Autore: {nota.nomeCompletoProprietario}</small>
                                    <hr />
                                </div>
                            ))
                        ) : (
                            <p>Nessuna nota presente</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DettagliPaziente;