import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../css/MappaRealTime.scss";
import { Link } from "react-router-dom";

// Fix per l'icona del marker di Leaflet
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

    /**
     * Restituisce minuti dall'inizio del giorno (0..1439).
     * Se la stringa non è valida, ritorna null.
     */
    const parseTimeToMinutes = (timeStr: string): number | null => {
        if (!timeStr) return null;
        const t = timeStr.trim();
        // accetta "HH:mm" o "HH:mm:ss"
        const m = t.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
        if (!m) return null;
        const hh = Number(m[1]);
        const mm = Number(m[2]);
        const ss = m[3] ? Number(m[3]) : 0;
        if (hh < 0 || hh > 23 || mm < 0 || mm > 59 || ss < 0 || ss > 59) return null;
        return hh * 60 + mm + Math.floor(ss / 60);
    };

    /**
     * Verifica se la clinica è aperta ora.
     */
    const isClinicOpen = (orari: OrariDiAperturaDTO[]): boolean => {
        if (!orari || orari.length === 0) return false;

        const now = new Date();
        const days = ['Domenica', 'Lunedi', 'Martedi', 'Mercoledi', 'Giovedi', 'Venerdi', 'Sabato'];
        const currentDay = days[now.getDay()];
        const nowMinutes = now.getHours() * 60 + now.getMinutes();



        // cerca l'orario per il giorno corrente (case-insensitive, trim)
        const todaySchedule = orari.find(o => o.giorno?.trim().toLowerCase() === currentDay.toLowerCase());
        console.log(todaySchedule);
        if (!todaySchedule) return false;

        if (todaySchedule.aperto24h) return true;

        const openMin = parseTimeToMinutes(todaySchedule.orarioApertura);
        const closeMin = parseTimeToMinutes(todaySchedule.orarioChiusura);

        if (openMin === null || closeMin === null) return false; // input malformato -> consideriamo chiuso

        if (openMin === closeMin) {
            // possibile interpretazione: chiuso tutto il giorno oppure aperto 24h.
            // qui assumiamo che apertura==chiusura significa CHIUSO (se non impostato aperto24h)
            return false;
        }

        // caso normale: apertura < chiusura (es. 08:00 - 18:00)
        if (openMin < closeMin) {
            return nowMinutes >= openMin && nowMinutes < closeMin;
        }

        // caso notturno: apertura > chiusura (es. 22:00 - 06:00)
        // in questo caso è aperto se ora >= open OR ora < close (attraverso mezzanotte)
        return nowMinutes >= openMin || nowMinutes < closeMin;
    };

    const getTodayHours = (orari: OrariDiAperturaDTO[]): string => {
        if (!orari || orari.length === 0) return "Orari non disponibili";

        const now = new Date();
        const days = ['Domenica', 'Lunedi', 'Martedi', 'Mercoledi', 'Giovedi', 'Venerdi', 'Sabato'];
        const currentDay = days[now.getDay()];

        const todaySchedule = orari.find(o => o.giorno.toLowerCase() === currentDay.toLowerCase());

        if (!todaySchedule) {
            return "Chiuso oggi";
        }

        if (todaySchedule.aperto24h) {
            return "Aperto 24h";
        }
        return `${todaySchedule.giorno} ${todaySchedule.orarioApertura} - ${todaySchedule.orarioChiusura}`;
    };

    // Default center (Salerno area as shown in mockup)
    const [mapCenter, setMapCenter] = useState<[number, number]>([40.77452909432953, 14.789611839747426]);
    const defaultZoom = 16;

    useEffect(() => {
        const fetchCliniche = async (lat?: number, lon?: number) => {
            try {
                if (typeof lat !== 'number' && typeof lon !== 'number') {
                    console.error("Coordinate non valide: ", lat, lon);
                    return;
                }
                const url = `http://localhost:8080/reportCliniche/mostraMappa/${lat}/${lon}`;

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
                    console.log('Posizione trovata:', latitude, longitude);
                    setMapCenter([latitude, longitude]);
                    fetchCliniche(latitude, longitude);
                },
                (error) => {
                    // dettagli utili per debug
                    console.warn('Geolocation error:', error);
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            console.error('Permesso negato dall\'utente.');
                            break;
                        case error.POSITION_UNAVAILABLE:
                            console.error('Posizione non disponibile (nessun provider disponibile o segnale).');
                            break;
                        case error.TIMEOUT:
                            console.error('Timeout nella richiesta di geolocalizzazione.');
                            break;
                        default:
                            console.error('Errore sconosciuto nella geolocalizzazione.');
                    }
                },
                {
                    enableHighAccuracy: true, // prova a chiedere sensori più precisi
                    timeout: 15000,           // 15 secondi
                    maximumAge: 0
                }
            );
        } else {
            console.warn('Geolocation API non supportata da questo browser.');
        }
    }, []);

    const handleMarkerClick = (clinicaId: number) => {
        setSelectedClinicId(clinicaId);
        // Scroll to clinic card in sidebar
        const element = document.getElementById(`clinic-card-${clinicaId}`);
        if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "center" });
        }
    };

    return (
        <div className="mappa-realtime-container">
            <div className="page-content">
                {/* Search Section */}
                <div className="search-section">
                    <h1 className="page-title">Trova un Veterinario</h1>
                    <div className="search-controls">
                        <div className="search-filters">
                            <label className="filter-checkbox">
                                <input type="checkbox" />
                                <span>Distanza fino a 100km</span>
                            </label>
                            <label className="filter-checkbox checked">
                                <input type="checkbox" defaultChecked />
                                <span>Aperto per emergenze</span>
                            </label>
                        </div>
                    </div>
                </div>

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
                                {cliniche.map((clinica) => (
                                    <Marker
                                        key={clinica.clinicaId}
                                        position={[clinica.latitudine, clinica.longitudine]}
                                        eventHandlers={{
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

                    {/* Sidebar Section */}
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
                                                <span className={`status-badge ${isClinicOpen(clinica.orariDiApertura) ? 'open' : 'closed'}`}>
                                                    {isClinicOpen(clinica.orariDiApertura) ? 'Aperto' : 'Chiuso'}
                                                </span>
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
