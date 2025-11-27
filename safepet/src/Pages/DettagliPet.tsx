import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Title from "../components/Title/Title";
import FormNota from "../components/formAggiuntaNota/FormNota";
import "../css/dettagli.scss";

const formatDate = (dateString: string | undefined | null): string => {
    if (!dateString) return "-";
    try {
        return dateString.split("T")[0];
    } catch (e) {
        return String(dateString);
    }
};

// Tipi per le entità cliniche
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

// Cartella clinica aggregata
type CartellaClinica = {
    visiteMediche: VisitaMedicaResponseDTO[];
    patologie: PatologiaResponseDTO[];
    terapie: TerapiaResponseDTO[];
    vaccinazioni: VaccinazioneResponseDTO[];
};

// Anagrafica pet
type Paziente = {
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

type DettagliPetResponseDTO = {
    anagraficaDTO: Paziente;
    cartellaClinicaDTO: CartellaClinica;
    noteProprietarioDTO: Nota[];
};

const DettagliPet: React.FC = () => {
    const [dettagli, setDettagli] = useState<DettagliPetResponseDTO | null>(null);
    const [loadingError, setLoadingError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<"vaccinazioni" | "visite" | "patologie" | "terapie">("vaccinazioni");
    const [showModal, setShowModal] = useState(false);
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!id || !token) {
            setLoadingError("ID pet o token mancante.");
            return;
        }

        const fetchDettagliPet = async () => {
            try {
                const response = await fetch(`http://localhost:8080/gestionePet/dettaglioPet/${id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    const data: DettagliPetResponseDTO = await response.json();
                    setDettagli(data);
                } else {
                    setLoadingError(`Errore HTTP: ${response.status}`);
                }
            } catch (error) {
                console.error("Errore di connessione:", error);
                setLoadingError("Errore di rete o server non raggiungibile.");
            }
        };

        fetchDettagliPet();
    }, [id]);

    const renderTabContent = () => {
        if (loadingError) return <div className="error-message">ERRORE: {loadingError}</div>;
        if (!dettagli) return <div>Caricamento dati...</div>;

        const clinicalRecord = dettagli.cartellaClinicaDTO;

        switch (activeTab) {
            case "vaccinazioni":
                return (
                    <>
                        {clinicalRecord.vaccinazioni.length > 0 ? (
                            clinicalRecord.vaccinazioni.map((v) => (
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
                return (
                    <>
                        {clinicalRecord.visiteMediche.length > 0 ? (
                            clinicalRecord.visiteMediche.map((v) => (
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
                return (
                    <>
                        {clinicalRecord.patologie.length > 0 ? (
                            clinicalRecord.patologie.map((p) => (
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
                return (
                    <>
                        {clinicalRecord.terapie.length > 0 ? (
                            clinicalRecord.terapie.map((t) => (
                                <div key={t.terapiaId} className="clinical-item">
                                    <h4>Terapia: {t.nome}</h4>
                                    <p><strong>Motivo:</strong> {t.motivo}</p>
                                    <p><strong>Dosaggio/Frequenza:</strong> {t.dosaggio} ({t.frequenza})</p>
                                    <p><strong>Forma/Via:</strong> {t.formaFarmaceutica}, {t.viaDiSomministrazione}</p>
                                    <p className="veterinario-info">Prescritta da: {t.nomeVeterinarioCompleto}</p>
                                    <hr />
                                </div>
                            ))
                        ) : (
                            <h4>Nessuna terapia registrata</h4>
                        )}
                    </>
                );
        }
    };

    return (
        <div className="dettaglio-pet">
            {dettagli && (
                <>
                    <Title text={`Dettagli di ${dettagli.anagraficaDTO.nome}`} />

                    {/* Photo Container */}
                    <div className="photo-container">
                        <img src={`data:image/png;base64,${dettagli.anagraficaDTO.fotoBase64}`} alt="Foto Pet" />
                        <strong>{dettagli.anagraficaDTO.nome}</strong>
                    </div>

                    {/* Dettagli Card con info anagrafica */}
                    <div className="dettagli-card">
                        <div className="profile-section">
                            <div className="info-section">
                                <div className="info-block">
                                    <h3>Informazioni Generali</h3>
                                    <p><b>Specie:</b> {dettagli.anagraficaDTO.specie}</p>
                                    <p><b>Razza:</b> {dettagli.anagraficaDTO.razza}</p>
                                    <p><b>Sesso:</b> {dettagli.anagraficaDTO.sesso}</p>
                                    <p><b>Data di nascita:</b> {formatDate(dettagli.anagraficaDTO.dataNascita)}</p>
                                </div>
                            </div>
                        </div>

                    {/* Cartella Clinica */}
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
                        </div>
                        <div className="cartella-content">{renderTabContent()}</div>
                    </div>

                    <div className="note-proprietario-section">
                        <div className="cartella-header">
                            <h3>Note Proprietario</h3>
                        </div>
                        {dettagli?.noteProprietarioDTO?.length ? (
                            dettagli.noteProprietarioDTO.map((nota) => (
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

                        {/* Pulsante per aggiungere nuova nota */}
                        <button onClick={() => setShowModal(true)}>Aggiungi Nota</button>

                        {showModal && (
                            <FormNota
                                petId={Number(id)}
                                onSuccess={(data) => {
                                    console.log("Nota aggiunta:", data);
                                    setDettagli((prev) =>
                                        prev
                                            ? {
                                                ...prev,
                                                noteProprietarioDTO: [...prev.noteProprietarioDTO, data],
                                            }
                                            : prev
                                    );
                                }}
                                onClose={() => setShowModal(false)}
                            />
                        )}
                    </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DettagliPet;