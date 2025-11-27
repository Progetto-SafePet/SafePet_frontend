import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Title from "../components/Title/Title";
import "../css/dettagli.scss";

import FormPatologia from "../components/formRecordMedico/formPatologia";
import FormVaccinazione from "../components/formRecordMedico/FormVaccinazione";
import FormVisitaMedica from "../components/formRecordMedico/FormVisitaMedica";
import FormTerapia from "../components/formRecordMedico/formTerapia";

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
    const { id } = useParams<{ id: string }>();
    const petId = Number(id);

    const [pet, setPet] = useState<DettagliResponseDTO | null>(null);
    const [clinicalRecord, setClinicalRecord] = useState<CartellaClinica | null>(null);
    const [loadingError, setLoadingError] = useState<string | null>(null);
    const [activeTab, setActiveTab] =
        useState<"vaccinazioni" | "visite" | "patologie" | "terapie">("vaccinazioni");

    const [showPatologia, setShowPatologia] = useState(false);
    const [showVaccinazione, setShowVaccinazione] = useState(false);
    const [showVisita, setShowVisita] = useState(false);
    const [showTerapia, setShowTerapia] = useState(false);

    const token = localStorage.getItem("token");

    const reloadClinicalRecord = async () => {
        if (!token) return;

        const res = await fetch(
            `http://localhost:8080/gestioneCartellaClinica/cartellaClinica/${petId}`,
            {
                method: "GET",
                headers: { "Authorization": `Bearer ${token}` }
            }
        );

        if (res.ok) {
            setClinicalRecord(await res.json());
        }
    };

    useEffect(() => {
        if (!token) {
            setLoadingError("Token mancante");
            return;
        }

        const fetchPaziente = async () => {
            const res = await fetch(
                `http://localhost:8080/gestionePaziente/dettagli/${petId}`,
                { headers: { "Authorization": `Bearer ${token}` } }
            );

            if (res.ok) setPet(await res.json());
        };

        const fetchCartella = async () => {
            const res = await fetch(
                `http://localhost:8080/gestioneCartellaClinica/cartellaClinica/${petId}`,
                { headers: { "Authorization": `Bearer ${token}` } }
            );

            if (res.ok) setClinicalRecord(await res.json());
        };

        fetchPaziente();
        fetchCartella();
    }, [petId]);

    if (!pet) return <div>Caricamento...</div>;

    const getActionLabel = (tab: typeof activeTab) => {
        switch (tab) {
            case "vaccinazioni":
                return "Vaccinazione";
            case "visite":
                return "Visita Medica";
            case "patologie":
                return "Patologia";
            case "terapie":
                return "Terapia";
            default:
                return "";
        }
    };

    const renderTabContent = () => {
        if (!clinicalRecord) return <div>Caricamento cartella...</div>;

        switch (activeTab) {
            case "vaccinazioni":
                return (
                    <>
                        {clinicalRecord.vaccinazioni.length > 0 ? (
                            clinicalRecord.vaccinazioni.map(v => (
                                <div key={v.vaccinazioneId} className="clinical-item">
                                    <h4>{v.nomeVaccino} ({v.tipologia})</h4>
                                    <p><strong>Data:</strong> {formatDate(v.dataDiSomministrazione)}</p>
                                    <p><strong>Dose:</strong> {v.doseSomministrata} ml</p>
                                    <p><strong>Via:</strong> {v.viaDiSomministrazione}</p>
                                    <p><strong>Richiamo:</strong> {formatDate(v.richiamoPrevisto)}</p>
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
                            clinicalRecord.visiteMediche.map(v => (
                                <div key={v.visitaMedicaId} className="clinical-item">
                                    <h4>Visita: {v.nome}</h4>
                                    <p><strong>Data:</strong> {formatDate(v.data)}</p>
                                    <p><strong>Descrizione:</strong> {v.descrizione}</p>
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
                            clinicalRecord.patologie.map(p => (
                                <div key={p.patologiaId} className="clinical-item">
                                    <h4>{p.nome}</h4>
                                    <p><strong>Data diagnosi:</strong> {formatDate(p.dataDiDiagnosi)}</p>
                                    <p><strong>Sintomi:</strong> {p.sintomiOsservati}</p>
                                    <p><strong>Diagnosi:</strong> {p.diagnosi}</p>
                                    <p><strong>Terapia:</strong> {p.terapiaAssociata}</p>
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
                            clinicalRecord.terapie.map(t => (
                                <div key={t.terapiaId} className="clinical-item">
                                    <h4>{t.nome}</h4>
                                    <p><strong>Motivo:</strong> {t.motivo}</p>
                                    <p><strong>Dosaggio:</strong> {t.dosaggio}</p>
                                    <p><strong>Durata:</strong> {t.durata}</p>
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
        <div className="page-container">
            <Title text="Dettagli paziente" />

            <div className="photo-container">
                {pet.fotoBase64 ? (
                    <img src={`data:image/jpeg;base64,${pet.fotoBase64}`} alt="Foto" />
                ) : (
                    <img src="../imgs/vetPlaceholder.jpg" alt="Foto" />
                )}
                <strong>{pet.nome}</strong>
            </div>

            <div className="dettagli-card">
                <div className="profile-section">

                    <div className="info-section">
                        <div className="info-block">
                            <strong>Informazioni Anagrafiche</strong>
                            <p><strong>Specie:</strong> {pet.specie}</p>
                            <p><strong>Razza:</strong> {pet.razza || "-"}</p>
                            <p><strong>Sesso:</strong> {pet.sesso}</p>
                            <p><strong>Nascita:</strong> {pet.dataNascita}</p>
                            <p><strong>Proprietario:</strong> {pet.proprietarioCompleto}</p>
                        </div>

                        <div className="info-block">
                            <strong>Informazioni Fisiche</strong>
                            <p><strong>Peso:</strong> {pet.peso ?? "-"} kg</p>
                            <p><strong>Mantello:</strong> {pet.coloreMantello}</p>
                            <p><strong>Microchip:</strong> {pet.microchip}</p>
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
                                    <li className={activeTab === "vaccinazioni" ? "active" : ""}
                                        onClick={() => setActiveTab("vaccinazioni")}>
                                        Vaccinazioni
                                    </li>
                                    <li className={activeTab === "visite" ? "active" : ""}
                                        onClick={() => setActiveTab("visite")}>
                                        Visite
                                    </li>
                                    <li className={activeTab === "patologie" ? "active" : ""}
                                        onClick={() => setActiveTab("patologie")}>
                                        Patologie
                                    </li>
                                    <li className={activeTab === "terapie" ? "active" : ""}
                                        onClick={() => setActiveTab("terapie")}>
                                        Terapie
                                    </li>
                                </ul>
                            </div>

                            <button
                                onClick={() => {
                                    if (activeTab === "patologie") setShowPatologia(true);
                                    if (activeTab === "vaccinazioni") setShowVaccinazione(true);
                                    if (activeTab === "visite") setShowVisita(true);
                                    if (activeTab === "terapie") setShowTerapia(true);
                                }}>
                                Aggiungi {getActionLabel(activeTab)}
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

                        {pet.noteProprietario.length > 0 ? (
                            pet.noteProprietario.map(n => (
                                <div key={n.idNota} className="nota-item">
                                    <h4>{n.titolo}</h4>
                                    <p>{n.descrizione}</p>
                                    <small>Pet: {n.nomePet} | Autore: {n.nomeCompletoProprietario}</small>
                                    <hr />
                                </div>
                            ))
                        ) : (
                            <p>Nessuna nota presente</p>
                        )}
                    </div>
                </div>
            </div>

            {showPatologia && (
                <FormPatologia
                    petId={petId}
                    onClose={() => setShowPatologia(false)}
                    onSuccess={() => {
                        reloadClinicalRecord();
                        setShowPatologia(false);
                    }}
                />
            )}

            {showVaccinazione && (
                <FormVaccinazione
                    petId={petId}
                    onClose={() => setShowVaccinazione(false)}
                    onSuccess={() => {
                        reloadClinicalRecord();
                        setShowVaccinazione(false);
                    }}
                />
            )}

            {showVisita && (
                <FormVisitaMedica
                    petId={petId}
                    onClose={() => setShowVisita(false)}
                    onSuccess={() => {
                        reloadClinicalRecord();
                        setShowVisita(false);
                    }}
                />
            )}

            {showTerapia && (
                <FormTerapia
                    petId={petId}
                    onClose={() => setShowTerapia(false)}
                    onSuccess={() => {
                        reloadClinicalRecord();
                        setShowTerapia(false);
                    }}
                />
            )}
        </div>
    );
};

export default DettagliPaziente;