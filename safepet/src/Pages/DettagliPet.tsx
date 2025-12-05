import React, { useEffect, useState } from "react";
import {useParams} from "react-router-dom";
import FormNota from "../components/formAggiuntaNota/FormNota";
import "../css/dettagli.scss";

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

type LinkingCodeResponseDTO = {
    nomePet: string;
    codice: string;
    dataScadenza: string;
    isScaduto: boolean;
    isUsato: boolean;
}

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
                const response = await fetch(`/gestionePet/dettaglioPet/${id}`, {
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
                                </div>
                            ))
                        ) : (
                            <h4>Nessuna terapia registrata</h4>
                        )}
                    </>
                );
        }
    };

    const [linkingCode, setLinkingCode] = useState<LinkingCodeResponseDTO | null>(null);
    const [isVisibleLinkingCode, setIsVisibleLinkingCode] = useState(false);

    const generaLinkingCode = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`/gestionePaziente/generaLinkingCode`, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    petId: id
                })
            });

            if (response.ok) {
                try {
                    const data: LinkingCodeResponseDTO = await response.json() // JSON.parse(text);
                    setLinkingCode(data);
                } catch (e) {
                    setLoadingError("Risposta server non in formato JSON valido.");
                }
            } else {
                setLoadingError(`Errore HTTP: ${response.status}`);
            }
        } catch (error) {
            console.error("Errore di connessione:", error);
            setLoadingError("Errore di rete o server non raggiungibile.");
        }
    };

    const toggleBox = async () => {
        if (!isVisibleLinkingCode) {
            await generaLinkingCode();
            setIsVisibleLinkingCode(true);
        } else {
            setIsVisibleLinkingCode(false);
        }
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString("it-IT").replaceAll("/", "-");
    };

    const handleDownload = async () => {
        if (!id) return;

        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const response = await fetch(
                `/gestioneCondivisioneDati/pdf/${id}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                console.error("Errore download:", response.status);
                return;
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);

            const a = document.createElement("a");
            a.href = url;
            a.download = `LibrettoSanitario_Pet_${id}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();

            window.URL.revokeObjectURL(url);
        } catch (e) {
            console.error("Errore di rete nel download:", e);
        }
    };

    return (
        <div className="page-container">
            <div className="page"></div>
            <div className="dettaglio-pet">
                {dettagli && (
                    <>
                        <div className="pet-header">
                            <div className="photo-container">
                                <img src={`data:image/png;base64,${dettagli.anagraficaDTO.fotoBase64}`} alt="Foto Pet" />
                                <strong>{dettagli.anagraficaDTO.nome}</strong>
                            </div>
                            <div className="header-actions">
                                <button className="button-primary" onClick={toggleBox}>Linking code</button>
                                <button className="button-primary" onClick={handleDownload}> Scarica Libretto </button>
                            </div>
                        </div>

                        {/* Dettagli Card con info */}
                        <div className="dettagli-card">
                            <div className="dettagli-block">
                                <div className="profile-section">
                                    <div className="info-section">
                                        <div className="info-block">
                                            <h3>Anagrafica</h3>
                                            <p><b>Specie:</b> {dettagli.anagraficaDTO.specie}</p>
                                            <p><b>Razza:</b> {dettagli.anagraficaDTO.razza}</p>
                                            <p><b>Sesso:</b> {dettagli.anagraficaDTO.sesso}</p>
                                            <p><b>Data di nascita:</b> {formatDate(dettagli.anagraficaDTO.dataNascita)}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="profile-section">
                                    <div className="info-section">
                                        <div className="info-block">
                                            <h3>Dettagli</h3>
                                            <p><b>Peso:</b> {dettagli.anagraficaDTO.peso} Kg</p>
                                            <p><b>Colore Mantello:</b> {dettagli.anagraficaDTO.coloreMantello}</p>

                                            <p>
                                                <b>Sterilizzato:</b>
                                                {dettagli.anagraficaDTO.sterilizzato ? (
                                                    <span style={{ color: 'green' }}> ✔ </span>
                                                ) : (
                                                    <span style={{ color: 'red' }}> ✖ </span>
                                                )}
                                            </p>

                                            <p><b>N. Microchip:</b> {dettagli.anagraficaDTO.microchip}</p>

                                        </div>
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
                                            <li className={activeTab === "vaccinazioni" ? "active" : ""}
                                                onClick={() => setActiveTab("vaccinazioni")}>Vaccinazioni
                                            </li>
                                            <li className={activeTab === "visite" ? "active" : ""}
                                                onClick={() => setActiveTab("visite")}>Visite
                                            </li>
                                            <li className={activeTab === "patologie" ? "active" : ""}
                                                onClick={() => setActiveTab("patologie")}>Patologie
                                            </li>
                                            <li className={activeTab === "terapie" ? "active" : ""}
                                                onClick={() => setActiveTab("terapie")}>Terapie
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="cartella-content">{renderTabContent()}</div>
                            </div>

                            {/* Note Proprietario */}
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

                                {isVisibleLinkingCode && (
                                    <div id="linking-code-box" className={"linking-code-box"}>
                                        <h4>Linking code - {dettagli.anagraficaDTO.nome}</h4>
                                        <h2 className="linking-code">{linkingCode.codice}</h2>
                                        <div className="expiration-box">
                                            <p className="expiration-date">Scadenza: {formatDate(linkingCode.dataScadenza)}</p>
                                            {linkingCode.isScaduto && (
                                                <div className="expired-icon" data-tooltip="Il codice è scaduto, generane uno nuovo">⚠</div>
                                            ) || (linkingCode.isUsato && (
                                                <div className="expired-icon" data-tooltip="Il codice è usato, generane uno nuovo">⚠</div>
                                            ))}
                                        </div>
                                        <div className="buttons">
                                            <button className="button-primary" onClick={generaLinkingCode}>Rigenera</button>
                                            <button className="button-primary" onClick={toggleBox}>Chiudi</button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                )}

            </div>
        </div>
    );
};

export default DettagliPet;