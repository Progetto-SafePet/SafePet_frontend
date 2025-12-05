import React, { useEffect, useState } from "react";
import Title from "../components/Title/Title";
import BannerHomepage from "../components/BannerHomepage/BannerHomepage";
import Carousel from "../components/Carousel/Carousel";
import Banner from "../components/Banner/Banner";
import { useUser } from "../Contexts/UserProvider";
import {Link, useNavigate} from "react-router-dom";

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
    const { usernameGlobal } = useUser();
    const navigate = useNavigate();
    

    useEffect(() => {
        const fetchVet = async () => {
            try {
                const response = await fetch("/reportCliniche/elencoVeterinari", {
                    method: "GET",
                });

                if (response.ok) {
                    const data = await response.json();
                    setVeterinari(data);
                } else {
                    console.log("Errore durante il recupero dei veterinari.");
                }
            } catch (error) {
                console.error("Errore di connessione:", error);
                console.log("Errore di connessione al server.");
            }
        };

        fetchVet();
    }, []);

    return (
        <div className="page-container">
            <div className="page">
                <div className='main-container'></div>
                    <Title text={"Lista veterinari"}/>
                    <div className="veterinario-container">
                    {Veterinari.length === 0 ? (
                        <p className="no-vet">Nessun veterinario presente</p>
                    ) : (
                        Veterinari.map((vet) => (
                            <Link
                                key={vet.idVeterinario}
                                className="veterinario-card"
                                to={`/veterinario/${vet.idVeterinario}`}
                                style={{ cursor: "pointer" }}
                            >
                                <div className="veterinario-image">
                                    <img src={`../imgs/vetPlaceholder.jpg`} alt={"Foto veterinario"}/>
                                </div>

                                <div className="veterinario-content">
                                    <h1 className="veterinario-title">{vet.nomeVeterinario} {vet.cognomeVeterinario}</h1>
                                    <div className="veterinario-description">
                                        <StarRating rating={Math.round(vet.mediaRecensioni)} />
                                        <div className={"nome-clinica"}>
                                            {vet.nomeClinica} <br />
                                        </div>
                                        {vet.indirizzoClinica.replace(" - ", "\n")} <br />
                                        <strong>Telefono: </strong>{vet.telefonoClinica} <br />
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
                    
                </div>
                {!usernameGlobal && (
                    <Banner
                        text="Registrati a SafePet per registrare il tuo pet e scoprire tutti i vantaggi"
                        buttonText="Registrati"
                        link = "/signup"
                    >
                    </Banner>
                 )}
            </div>
        </div>
    );
};

export default ElencoVet;