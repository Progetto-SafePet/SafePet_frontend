import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Title from "../components/Title/Title";
import "../css/DettagliPaziente.scss";

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

const DettagliPaziente: React.FC = () => {
    const [pet, setPet] = useState<Paziente | null>(null);
    const [activeTab, setActiveTab] = useState<"vaccinazioni" | "visite" | "patologie" | "terapie">("vaccinazioni");
    const { id } = useParams<{ id: string }>();

    useEffect(() => {
        const fetchPaziente = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!id) return;

                const response = await fetch(`http://localhost:8080/gestionePaziente/dettagli/${id}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setPet(data);
                } else {
                    console.log("Errore durante il recupero del paziente.");
                }
            } catch (error) {
                console.error("Errore di connessione:", error);
            }
        };

        fetchPaziente();
    }, [id]);

    const renderTabContent = () => {
        switch (activeTab) {
            case "vaccinazioni":
                return (
                    <>
                    <div>
                        <h4>Nobivac DHPPi</h4>
                        <p>Vaccino polivalente</p>
                        <p><strong>Data vaccinazione:</strong> 10/03/2025</p>
                        <p><strong>Richiamo previsto:</strong> 10/03/2026</p>
                        <button>Aggiungi nuova vaccinazione</button>
                    </div>
                    </>
                );
            case "visite":
                return (
                    <div>
                        <h4>Visita di controllo</h4>
                        <p><strong>Data:</strong> 15/04/2025</p>
                        <p>Esame generale, tutto regolare.</p>
                        <button>Aggiungi nuova visita</button>
                    </div>
                );
            case "patologie":
                return (
                    <div><h4>Nessuna patologia registrata</h4>
                        <button>Aggiungi nuova patologia</button>
                    </div>
            );
            case "terapie":
                return (
                    <div>
                        <h4>Terapia dermatologica</h4>
                        <p><strong>Farmaco:</strong> Crema lenitiva</p>
                        <p><strong>Durata:</strong> 7 giorni</p>
                        <button>Aggiungi nuova terapia</button>
                    </div>
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
                        <div className="cartella-tabs">
                            <ul>
                                <li className={activeTab === "vaccinazioni" ? "active" : ""} onClick={() => setActiveTab("vaccinazioni")}>Vaccinazioni</li>
                                <li className={activeTab === "visite" ? "active" : ""} onClick={() => setActiveTab("visite")}>Visite</li>
                                <li className={activeTab === "patologie" ? "active" : ""} onClick={() => setActiveTab("patologie")}>Patologie</li>
                                <li className={activeTab === "terapie" ? "active" : ""} onClick={() => setActiveTab("terapie")}>Terapie</li>
                            </ul>
                        </div>
                        <div className="cartella-content">
                            {renderTabContent()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DettagliPaziente;
