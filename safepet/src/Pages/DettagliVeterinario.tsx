import React from "react";
import "leaflet/dist/leaflet.css";
import "../css/DettagliVeterinario.scss";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import MappaClinica from "../components/MappaClinica/MappaClinica";
import FormRecensione from "../components/formAggiuntaRecensione/AggiungiRecensione";

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
    nomeProprietario: string,
    cognomeProprietario: string,
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
    latitudineClinica: number;
    longitudineClinica: number;
    orarioDiAperturaClinica: OrariClinica[];
    listaRecensioniVeterinario: Recensioni[];
    mediaRecensione: number;
}

function DettagliVeterinario() {
    const { id } = useParams();
    const [veterinario, setVeterinario] = useState<Veterinario | null>(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetch(`http://localhost:8080/gestioneUtente/visualizzaDettagliVeterinari/${id}`)
            .then(res => res.json())
            .then(data => setVeterinario(data))
            .catch(err => console.error("Errore caricamento veterinario:", err));
    }, [id]);

    if (!veterinario) return <p>Caricamento...</p>;

       return (
        <div className="contenitore-dettagli">

            <section className="dettagli-veterinario">
                <div className="foto-box">
                    <img src={`../imgs/vetPlaceholder.jpg`} alt="Foto veterinario" />
                </div>

                <div className="info-box">
                    <h2>{veterinario.nomeVeterinario} {veterinario.cognome}</h2>

                    <p><strong>Email:</strong> {veterinario.email}</p>
                    <p><strong>Telefono:</strong> {veterinario.numeroTelefonoVeterinario}</p>
                    <p><strong>Data di nascita:</strong> {new Date(veterinario.dataNascita).toLocaleDateString()}</p>
                    <p><strong>Genere:</strong> {veterinario.genere}</p>
                    <p><strong>Specializzazione:</strong> {veterinario.specializzazioniAnimali}</p>
                </div>
            </section>

            <section className="dettagli-clinica">
                <div className="clinica-info">
                    <h2>Clinica</h2>

                    <p><strong>{veterinario.nomeClinica}</strong></p>
                    <p>{veterinario.indirizzoClinica}</p>
                    <p><strong>Telefono:</strong> {veterinario.numeroTelefonoClinica}</p>

                    <h3>Orari di apertura</h3>
                    <div className="orari">
                        {veterinario.orarioDiAperturaClinica?.map((o, index) => (
                            <div key={index}>
                                <strong>{o.giorno}:</strong>{" "}
                                {o.aperto24h
                                    ? "Aperto 24 ore"
                                    : `${o.orarioApertura.slice(0, 5)} - ${o.orarioChiusura.slice(0, 5)}`
                                }
                            </div>
                        ))}
                    </div>
                </div>

                <div className="clinica-mappa">
                    {veterinario.latitudineClinica && veterinario.longitudineClinica ? (
                        <MappaClinica
                            latitudine={veterinario.latitudineClinica}
                            longitudine={veterinario.longitudineClinica}
                            nomeClinica={veterinario.nomeClinica}
                            indirizzoClinica={veterinario.indirizzoClinica}
                        />
                    ) : (
                        <p>Posizione non disponibile</p>
                    )}
                </div>
            </section>

            <section className="recensioni-veterinario">
                <div className={"lista-recensioni"}>
                    <h2>Recensioni (⭐ {veterinario.mediaRecensione?.toFixed(1)})</h2>
                    <div className="lista-recensioni">
                        {veterinario.listaRecensioniVeterinario?.map(r => (
                            <div className="recensione-card" key={r.id}>
                                <div className="recensione-intestazione">
                                    <strong>{r.nomeProprietario} {r.cognomeProprietario}</strong>
                                    <span className="voto">{r.punteggio} ⭐</span>
                                </div>

                                <p className="descrizione">{r.descrizione}</p>
                            </div>
                        ))}
                    </div>

                    <button className="btn-recensione" onClick={() => setShowModal(true)}>
                        Aggiungi Recensione
                    </button>

                    {showModal && (
                        <FormRecensione
                            veterinarioId={Number(id)}
                            onSuccess={(data) => {
                                setVeterinario((prev) => {
                                    if (!prev) return prev;

                                    const nuove = [...prev.listaRecensioniVeterinario, data];
                                    const media = nuove.reduce((s, r) => s + r.punteggio, 0) / nuove.length;

                                    return { ...prev, listaRecensioniVeterinario: nuove, mediaRecensione: media };
                                });

                                setShowModal(false);
                            }}
                            onClose={() => setShowModal(false)}
                        />
                    )}
                </div>
            </section>
        </div>
    );
}

export default DettagliVeterinario;