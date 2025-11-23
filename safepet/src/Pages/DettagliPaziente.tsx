import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Title from "../components/Title/Title";
import "../css/DettagliPaziente.scss";
import { useUser } from "../Contexts/UserProvider";

const DettagliPaziente: React.FC = () => {
    const [Pet, setPet] = useState<any>(null);   // nessuna interface, uso any
    const { usernameGlobal } = useUser();
    const { id } = useParams<{ id: string }>();
    const [activeTab, setActiveTab] = useState<"vaccinazioni" | "visite" | "patologie" | "terapie">("vaccinazioni");

    useEffect(() => {
        const fetchPaziente = async () => {
            try {
                const response = await fetch(`http://localhost:8080/gestionePaziente/${id}`, {  //TODO: va aggiornato questo link
                    method: "GET",
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

        if (id) {
            fetchPaziente();
        }
    }, [id]);

    // TODO: aggiungere i campi da recuperare dal database
    const renderTabContent = () => {
        switch (activeTab) {
            case "vaccinazioni":
                return (
                    <div>
                        <h4>Nobivac DHPPi</h4>
                        <p>Vaccino polivalente</p>
                        <p><strong>Data vaccinazione:</strong> 10/03/2025</p>
                        <p><strong>Richiamo previsto:</strong> 10/03/2026</p>
                    </div>
                );
            case "visite":
                return (
                    <div>
                        <h4>Visita di controllo</h4>
                        <p><strong>Data:</strong> 15/04/2025</p>
                        <p>Esame generale, tutto regolare.</p>
                    </div>
                );
            case "patologie":
                return (
                    <div>
                        <h4>Nessuna patologia registrata</h4>
                    </div>
                );
            case "terapie":
                return (
                    <div>
                        <h4>Terapia dermatologica</h4>
                        <p><strong>Farmaco:</strong> Crema lenitiva</p>
                        <p><strong>Durata:</strong> 7 giorni</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="page-container">
            <Title text={"Dettagli paziente"} />
            <div className="photo-container">
                {Pet?.fotoBase64 ? (
                    <img src={`data:image/jpeg;base64,${Pet.fotoBase64}`} alt="Foto del pet" />
                ) : (
                    <img src="../imgs/vetPlaceholder.jpg" alt="Foto del pet" />
                )}
                <strong>{Pet?.nome || "Nome Pet"}</strong>
            </div>

            <div className="dettagli-card">
                <div className="profile-section">
                    <div className="info-section">
                        <div className="info-block">
                            <strong>Informazioni Anagrafiche</strong>
                            <p><strong>Nome:</strong> {Pet?.nome}</p>
                            <p><strong>Specie:</strong> {Pet?.specie}</p>
                            <p><strong>Razza:</strong> {Pet?.razza}</p>
                            <p><strong>Sesso:</strong> {Pet?.sesso}</p>
                            <p><strong>Data Nascita:</strong> {Pet?.dataNascita}</p>
                            <p><strong>Proprietario:</strong> {Pet?.proprietarioCompleto}</p>
                        </div>

                        <div className="info-block">
                            <strong>Informazioni Fisiche</strong>
                            <p><strong>Peso:</strong> {Pet?.peso} kg</p>
                            <p><strong>Colore Mantello:</strong> {Pet?.coloreMantello}</p>
                            <p><strong>Microchip:</strong> {Pet?.microchip}</p>
                            <p><strong>Sterilizzato:</strong> {Pet?.sterilizzato ? "Sì" : "No"}</p>
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
