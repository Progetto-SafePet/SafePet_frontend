import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../css/MappaRealTime.scss";
import { Link } from "react-router-dom";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface OrariDiAperturaDTO {
    giorno: string;
    orarioApertura: string;
    orarioChiusura: string;
    aperto24h: boolean;
}

interface ClinicaMappaDTO {
    clinicaId: number;
    nomeClinica: string;
    indirizzo: string;
    numeroTelefono: string;
    vetId: number;
    nomeVeterinario: string;
    cognomeVeterinario: string;
    numRecensioni: number;
    mediaRecensioni: number;
    latitudine: number;
    longitudine: number;
    orariDiApertura: OrariDiAperturaDTO[];
}

const StarRating = ({ rating, count }: { rating: number, count: number }) => {
    const maxStars = 5;
    return (
        <div className="star-rating" title={`Voto: ${rating}`}>
            {Array.from({ length: maxStars }, (_, i) => (
                <span
                    key={i}
                    className={i < Math.round(rating) ? "star filled" : "star"}
                >
                    ★
                </span>
            ))}
            <span className="rating-value">({count})</span>
        </div>
    );
};

const MappaRealTime = () => {
    const [cliniche, setCliniche] = useState<ClinicaMappaDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedClinicId, setSelectedClinicId] = useState<number | null>(null);
    const [expandedHoursId, setExpandedHoursId] = useState<number | null>(null);

    const toggleHours = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        setExpandedHoursId(expandedHoursId === id ? null : id);
    };

    const getTodayHours = (orari: OrariDiAperturaDTO[]): string => {
        if (!orari || orari.length === 0) return "Orari non disponibili";

        const now = new Date();
        const days = ['Domenica', 'Lunedi', 'Martedi', 'Mercoledi', 'Giovedi', 'Venerdi', 'Sabato'];
        const currentDay = days[now.getDay()];

        const todaySchedule = orari.find(o => o.giorno.toLowerCase() === currentDay.toLowerCase());

        if (todaySchedule.aperto24h) {
            return "Aperto 24h";
        }
        return `${todaySchedule.giorno} ${todaySchedule.orarioApertura} - ${todaySchedule.orarioChiusura}`;
    };

    const [mapCenter, setMapCenter] = useState<[number, number]>();
    const defaultZoom = 14;

    useEffect(() => {
        window.scrollTo(0, 0)

        /**
         * Invia una richiesta asincrona al server all'indirizzo http://localhost:8080/reportCliniche/mostraMappa per
         * prelevare i dati delle cinque cliniche (comprese le loro coordinate) più vicine alla posizione del client.
         *
         * @param lat Latitudine del client
         * @param lon Longitudine del client
         */
        const fetchCliniche = async (lat?: number, lon?: number) => {
            try {
                if (typeof lat !== 'number' && typeof lon !== 'number') {
                    console.error("Coordinate non valide: ", lat, lon);
                    return;
                }
                const url = `/reportCliniche/mostraMappa/${lat}/${lon}`;

                const response = await fetch(url, {
                    method: "GET",
                });

                if (response.ok) {
                    const data = await response.json();
                    setCliniche(data);
                } else {
                    setError("Errore durante il recupero delle cliniche.");
                }
            } catch (err) {
                console.error("Errore di connessione:", err);
                setError("Errore di connessione al server.");
            } finally {
                setLoading(false);
            }
        };

        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    if (!position || !position.coords) {
                        console.warn('Nessuna posizione valida ricevuta');
                        return;
                    }
                    const { latitude, longitude } = position.coords;
                    setMapCenter([latitude, longitude]);
                    fetchCliniche(latitude, longitude);
                },
                (error) => {
                    console.warn('Errore di geolocalizzazione:', error);
                    let message: string;
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            message = "Accesso alla posizione negato dall'utente.";
                            break;
                        case error.POSITION_UNAVAILABLE:
                            message = 'Posizione non disponibile (nessun provider disponibile o segnale).';
                            break;
                        case error.TIMEOUT:
                            message = 'Timeout nella richiesta di geolocalizzazione.';
                            break;
                        default:
                            message = 'Errore sconosciuto nella geolocalizzazione.';
                    }
                    console.error(message);
                    setLoading(false);
                    setError(message)
                },
                {
                    enableHighAccuracy: true,
                    timeout: 15000
                }
            );
        } else {
            console.warn('Geolocation API non supportata da questo browser.');
        }
    }, []);

    /**
     * Mette in evidenza nell'elenco di cliniche la clinic-card cliccata sulla mappa
     * @param clinicaId Id della clinica corrispondente al marker cliccato
     */
    const handleMarkerClick = (clinicaId: number) => {
        setSelectedClinicId(clinicaId);
        const element = document.getElementById(`clinic-card-${clinicaId}`);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };


    /**
     * Icona verde scuro utilizzata per il Marker corrispondente alla posizione dell'utente
     */
    const darkGreenMarker = new L.Icon({
        iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
        shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    return (
        <div className="page-container mappa-realtime-container">
            <div className="page">
                <h1 className="page-title">Trova un Veterinario</h1>
                {/* Main Content: Map + Sidebar */}
                <div className="main-content">
                    {/* Map Section */}
                    <div className="map-section">
                        {loading ? (
                            <div className="loading-state">Caricamento mappa...</div>
                        ) : error ? (
                            <div className="error-state">{error}</div>
                        ) : (
                            <MapContainer
                                center={mapCenter}
                                zoom={defaultZoom}
                                scrollWheelZoom={true}
                                className="map-container"
                            >
                                <TileLayer
                                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                                />


                                <Marker
                                    key={0}
                                    position={[mapCenter[0], mapCenter[1]]}
                                    icon={darkGreenMarker}
                                >
                                    <Popup>
                                        <div className="marker-popup">Ti trovi qui</div>
                                    </Popup>
                                </Marker>

                                {cliniche.map((clinica) => (
                                    <Marker
                                        key={clinica.clinicaId}
                                        position={[clinica.latitudine, clinica.longitudine]}
                                        eventHandlers={{
                                            // evidenza la clinica nell'elenco
                                            click: () => handleMarkerClick(clinica.clinicaId),
                                        }}
                                    >
                                        <Popup>
                                            <div className="marker-popup">
                                                <strong>{clinica.nomeClinica}</strong>
                                                <br />
                                                {clinica.indirizzo}
                                                <br />
                                                <strong>Tel:</strong> {clinica.numeroTelefono}
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))}
                            </MapContainer>
                        )}
                    </div>

                    <div className="sidebar-section">
                        <h2 className="sidebar-title">Risultati</h2>
                        <div className="clinics-list">
                            {loading ? (
                                <div className="loading-state">Caricamento...</div>
                            ) : error ? (
                                <div className="error-state">{error}</div>
                            ) : cliniche.length === 0 ? (
                                <p className="no-results">Nessuna clinica trovata</p>
                            ) : (
                                cliniche.map((clinica) => (
                                    <div
                                        key={clinica.clinicaId}
                                        id={`clinic-card-${clinica.clinicaId}`}
                                        className={`clinic-card ${selectedClinicId === clinica.clinicaId ? "selected" : ""
                                            }`}
                                    >
                                        <div className="clinic-card-header">
                                            <div className="vet-avatar">
                                                <img src="../imgs/vetPlaceholder.jpg" alt="Veterinario" />
                                            </div>
                                            <div className="clinic-info">
                                                <h3 className="clinic-name"> Clinica veterinaria {clinica.nomeClinica} </h3>
                                                <StarRating rating={clinica.mediaRecensioni} count={clinica.numRecensioni} />
                                            </div>
                                        </div>

                                        <div className="clinic-details">
                                            <p className="clinic-address">{clinica.indirizzo}</p>

                                            <div className="clinic-status-row">
                                                <span className="clinic-open-badge"> Aperto </span>
                                                <span className="today-hours">{getTodayHours(clinica.orariDiApertura)}</span>
                                            </div>

                                            <button
                                                className="view-hours-btn"
                                                onClick={(e) => toggleHours(e, clinica.clinicaId)}
                                            >
                                                {expandedHoursId === clinica.clinicaId ? 'Nascondi orari' : 'Vedi orari completi'}
                                            </button>

                                            {expandedHoursId === clinica.clinicaId && (
                                                <div className="hours-list">
                                                    {clinica.orariDiApertura.map((orario, idx) => (
                                                        <div key={idx} className="hour-row">
                                                            <span className="day">{orario.giorno}</span>
                                                            <span className="time">
                                                                {orario.aperto24h ? '24h' : `${orario.orarioApertura} - ${orario.orarioChiusura}`}
                                                            </span>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                        <p className="vet-name">Veterinario: {clinica.cognomeVeterinario} {clinica.nomeVeterinario}</p>
                                        <Link to={`/veterinario/${clinica.vetId}`} className="view-profile-btn">Vedi profilo</Link>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MappaRealTime;
