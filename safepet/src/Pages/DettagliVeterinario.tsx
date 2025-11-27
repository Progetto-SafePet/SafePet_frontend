import React from "react";
import "leaflet/dist/leaflet.css";
import "../css/DettagliVeterinario.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

type OrariClinica = {
    giorno: string;
    orarioApertura: string;
    orarioChiusura: string;
    aperto24h: boolean;
};

type Recensioni = {
    id: number;
    punteggio: number;
    descrizione: string;
    idProprietario: number;
    idVeterinario: number;
};

type Veterinario = {
    idVeterinario: number;
    nomeVeterinario: string;
    cognome: string;
    dataNascita: string;
    genere: string;
    email: string;
    numeroTelefonoVeterinario: string;
    specializzazioniAnimali: string;
    idClinica: number;
    nomeClinica: string;
    indirizzoClinica: string;
    numeroTelefonoClinica: string;
    latitudineClinica?: number;
    longitudineClinica?: number;
    orarioDiAperturaClinica: OrariClinica[];
    listaRecensioniVeterinario: Recensioni[];
    mediaRecensione: number;
}

function MappaClinica({ latitudineClinica, longitudineClinica }: { latitudineClinica: number; longitudineClinica: number }) {
    return (
        <div className="mappa-container">
            <MapContainer
                center={[latitudineClinica, longitudineClinica]}
                zoom={15}
                style={{ height: "300px", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <Marker position={[latitudineClinica, longitudineClinica]}>
                    <Popup>Clinica Veterinaria</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}

function DettagliVeterinario() {
    const { id } = useParams();
    const [veterinario, setVeterinario] = useState<Veterinario | null>(null);

    useEffect(() => {
        fetch(`http://localhost:8080/gestioneUtente/visualizzaDettagliVeterinari/${id}`)
            .then(res => res.json())
            .then(data => setVeterinario(data))
            .catch(err => console.error("Errore caricamento veterinario:", err));
    }, [id]);

    if (!veterinario) return <p>Caricamento...</p>;

    return (
        <div className="dettagli-card">
            <div className="veterinario-image">
                <img src={`../imgs/vetPlaceholder.jpg`} alt={"Foto veterinario"}/>
                <strong>
                    {veterinario.nomeVeterinario} {veterinario.cognome}
                </strong>
            </div>

            <div className="profile-section">
                <div className="info-section">
                    <div className="info-block">
                        <h3>Dettagli Veterinario</h3>
                        <p>Email: {veterinario.email}</p>
                        <p>Telefono: {veterinario.numeroTelefonoVeterinario}</p>
                        <p>Data di nascita: {new Date(veterinario.dataNascita).toLocaleDateString()}</p>
                        <p>Genere: {veterinario.genere}</p>
                        <p>Specializzazioni: {veterinario.specializzazioniAnimali}</p>
                    </div>

                    <div className="info-block">
                        <h3>Clinica</h3>
                        <p>{veterinario.nomeClinica}</p>
                        <p>{veterinario.indirizzoClinica}</p>
                        <p>Tel: {veterinario.numeroTelefonoClinica}</p>
                        <p>
                            Posizione: {veterinario.latitudineClinica}, {veterinario.longitudineClinica}
                        </p>
                    </div>
                </div>
            </div>

            {/* Mappa Clinica */}
            <div className="vet-section">
                <div className="vet-header">
                    <h3>Posizione Clinica</h3>
                </div>
                <div className="vet-content">
                    {veterinario.latitudineClinica && veterinario.longitudineClinica ? (
                        <div></div>
                    ) : (
                        <p>Posizione non disponibile</p>
                    )}
                </div>
            </div>

            {/* Recensioni */}
            <div className="vet-section">
                <div className="vet-header">
                    <h3>Recensioni (⭐ {veterinario.mediaRecensione?.toFixed(1)})</h3>
                </div>
                <div className="vet-content">
                    {veterinario.listaRecensioniVeterinario?.map(r => (
                        <p key={r.id}>
                            ⭐ {r.punteggio} - {r.descrizione}
                        </p>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DettagliVeterinario;
