import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./MappaClinica.scss"; // importa il tuo CSS/SCSS

type MappaClinicaProps = {
    latitudine: number;
    longitudine: number;
    nomeClinica: string;
    indirizzoClinica: string;
};

function MappaClinica({ latitudine, longitudine, nomeClinica, indirizzoClinica }: MappaClinicaProps) {
    return (
        <div className="mappa-clinica">
            <div className="mappa-header">
                <h3>{nomeClinica}</h3>
                <p className="mappa-indirizzo">{indirizzoClinica}</p>
            </div>

            <div className="mappa-container">
                <MapContainer
                    center={[latitudine, longitudine]}
                    zoom={15}
                    className="mappa-leaflet"
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[latitudine, longitudine]}>
                        <Popup>
                            <strong>{nomeClinica}</strong><br />
                            {indirizzoClinica}
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>
        </div>
    );
}

export default MappaClinica;
