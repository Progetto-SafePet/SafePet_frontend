import React, { useEffect, useState } from "react";
import "./ElencoVet.scss";

const ElencoVet = () => {
    const [Veterinari, setVeterinari] = useState([]);

    useEffect(() => {
        const fetchVet = async () => {
            try {
                const response = await fetch("http://localhost:8080/reportCliniche/visualizzaElencoVeterinari", {
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
                            <h3 className="promo-title">{vet.nomeVeterinario} {vet.cognomeVeterinario}</h3>
                            <p className="promo-description">
                                {vet.nomeClinica} <br />
                                {vet.indirizzoClinica} <br />
                                {vet.telefonoClinica} <br />
                            </p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default ElencoVet;