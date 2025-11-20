import React, { useEffect, useState } from "react";
import "./ElencoVet.scss";

const StarRating = ({ rating }) => {
    const maxStars = 5;

    return (
        <div className="star-rating">
            {Array.from({ length: maxStars }, (_, i) => (
                <span
                    key={i}
                    className={i < rating ? "star filled" : "star"}
                >
                    ★
                </span>
            ))}
        </div>
    );
};


const ElencoVet = () => {
    const [Veterinari, setVeterinari] = useState([]);

    useEffect(() => {
        const fetchVet = async () => {
            try {
                const response = await fetch("http://localhost:8080/reportCliniche/elencoVeterinari", {
                    method: "GET",
                });

                if (response.ok) {
                    const data = await response.json();
                    setVeterinari(data);
                } else {
                    alert("Errore durante il recupero dei veterinari.");
                }
            } catch (error) {
                console.error("Errore di connessione:", error);
                alert("Errore di connessione al server.");
            }
        };

        fetchVet();
    }, []);

    return (
        <>
            <div className = "title">
                <h3>Lista veterinari</h3>
            </div>
        <div className="promo-container">
            {Veterinari.length === 0 ? (
                <p className="no-vet">Nessun veterinari.</p>
            ) : (
                Veterinari.map((vet) => (
                    <div key={vet.idVeterinario} className="promo-card">
                        <div className="promo-image">
                            <img src={`../imgs/vetPlaceholder.jpg`} alt={"Foto veterinario"}/>
                        </div>

                        <div className="promo-content">
                            <h1 className="promo-title">{vet.nomeVeterinario} {vet.cognomeVeterinario}</h1>
                            <div className="promo-description">
                                <StarRating rating={Math.round(vet.mediaRecensioni)} />
                                <div className={"nome-clinica"}>
                                    {vet.nomeClinica} <br />
                                </div>
                                {vet.indirizzoClinica.replace(" - ", "\n")} <br />
                                <strong>Telefono: </strong>{vet.telefonoClinica} <br />
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
            </>
    );
};

export default ElencoVet;