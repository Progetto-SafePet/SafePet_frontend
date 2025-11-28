import React, { useEffect, useState } from "react";
import "../css/ListaPazienti.css";
import BannerHomepage from "../components/BannerHomepage/BannerHomepage";
import Carousel from "../components/Carousel/Carousel";
import ImageBanner from "../components/ImageBanner/ImageBanner";

type Paziente = {
    nome: string;
    specie: string;
    dataNascita: string;
    proprietario: string;
    sesso: string;
    fotoBase64?: string;
};
const promoData = [
    {
        image: "https://images.wagwalkingweb.com/media/daily_wag/blog_articles/hero/1723114015.705158/popular-dogs-hero-1.jpg",
        tag: "GESTIONE DIGITALE",
        title: "Libretto sanitario digitale",
        description:
            "Con SafePet hai un unico libretto sanitario digitale per ogni animale domestico. Tutte le informazioni veterinarie, i vaccini e le terapie sono centralizzati, sempre accessibili e aggiornati in tempo reale.",
    },
    {
        image: "https://brownvethospital.com/wp-content/uploads/2024/02/when-do-dogs-stop-growing.jpg",
        tag: "INTEGRAZIONE VETERINARIA",
        title: "Collaborazione tra veterinari e strutture",
        description:
            "SafePet connette cliniche, ambulatori e medici veterinari in un’unica rete digitale. La piattaforma facilita la condivisione sicura dei dati, riducendo tempi di diagnosi e migliorando la qualità delle cure.",
    },
    {
        image: "https://d3544la1u8djza.cloudfront.net/APHI/Blog/2023/September/small-breeds-hero.jpg",
        tag: "EMERGENZE INTELLIGENTI",
        title: "QR Code e interventi rapidi",
        description:
            "Ogni animale iscritto dispone di un QR Code identificativo: in caso di emergenza, veterinari o soccorritori possono accedere immediatamente alla sua scheda clinica per un intervento tempestivo e sicuro.",
    },
    {
        image: "../../imgs/vet-dog.png",
        tag: "INTELLIGENZA ARTIFICIALE",
        title: "Analisi dermatologica con AI",
        description:
            "La funzionalità SkinDetector utilizza l'intelligenza artificiale per analizzare foto della cute del tuo animale, identificando potenziali problematiche dermatologiche e fornendo un primo riscontro diagnostico orientativo.",
    },
    {
        image: "../../imgs/map-user.png",
        tag: "GEOLOCALIZZAZIONE",
        title: "Mappa delle cliniche nelle vicinanze",
        description:
            "Trova immediatamente le cliniche veterinarie aperte più vicine a te grazie alla mappa interattiva real-time. Visualizza orari, servizi disponibili e contatti per una risposta immediata alle emergenze.",
    },

];
const ListaPazienti = () => {
    const [pazienti, setPazienti] = useState<Paziente[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPazienti = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("Token mancante, effettua di nuovo il login.");
                    setLoading(false);
                    return;
                }

                const response = await fetch("http://localhost:8080/gestionePaziente/listaPazienti", {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.status === 404) {
                    // Veterinario senza pazienti
                    setPazienti([]);
                    setLoading(false);
                    return;
                }

                if (!response.ok) {
                    setError("Errore nel recupero dei pazienti.");
                    setLoading(false);
                    return;
                }

                const data = await response.json();
                setPazienti(data);
                setLoading(false);

            } catch (err) {
                setError("Errore del server.");
                setLoading(false);
            }
        };

        fetchPazienti();
    }, []);


    const formatDate = (d: string) => {
        if (!d) return "-";
        return new Date(d).toLocaleDateString("it-IT");
    };

    if (loading)
        return <p style={{ textAlign: "center", marginTop: "40px" }}>Caricamento pazienti...</p>;

    if (error)
        return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;

    if (!loading && pazienti.length === 0) {
        return (
            <div className="page-container">
                <BannerHomepage></BannerHomepage>
                <div className="page">
                    <div className='main-container'></div>
                    <div className="pazienti-container">
                        <h1 className="title">I tuoi pazienti</h1>

                        <p style={{
                            textAlign: "center",
                            marginTop: "30px",
                            fontSize: "18px",
                            opacity: 0.7
                        }}>
                            Non hai ancora pazienti associati al tuo profilo.
                        </p>
                    </div>
                    <ImageBanner
                        imagePath={"../imgs/aggiungi-paziente.jpg"}
                        description={"Vuoi aggiungere un pet alla tua lista di pazienti? Farlo non è mai stato così facile!"}
                        redirectLink={"/aggiuntaPaziente"}
                        buttonText={"Andiamo!"}
                    ></ImageBanner>
                    <Carousel cardsData={promoData} />
                </div>
            </div>
        );
    }

    return (
        <div className="page-container">
            <BannerHomepage></BannerHomepage>
            <div className="page">
                <div className='main-container'></div>
                <div className="pazienti-container">
                    <h1 className="title">I tuoi pazienti</h1>

                    <div className="pazienti-list">
                        {pazienti.map((p, index) => (
                            <div key={index} className="paziente-card">

                                {p.fotoBase64 ? (
                                    <img
                                        className="paziente-foto"
                                        src={`data:image/jpeg;base64,${p.fotoBase64}`}
                                        alt={p.nome}
                                    />
                                ) : (
                                    <img
                                        className="paziente-foto"
                                        src="https://via.placeholder.com/120"
                                        alt="placeholder"
                                    />
                                )}

                                <h2>{p.nome}</h2>

                                <p><strong>Specie:</strong> {p.specie}</p>
                                <p><strong>Sesso:</strong> {p.sesso === "M" ? "Maschio" : "Femmina"}</p>
                                <p><strong>Nascita:</strong> {formatDate(p.dataNascita)}</p>
                                <p><strong>Proprietario:</strong> {p.proprietario}</p>

                            </div>
                        ))}
                    </div>
                </div>
                <ImageBanner
                    imagePath={"../imgs/aggiungi-paziente.jpg"}
                    description={"Vuoi aggiungere un pet alla tua lista di pazienti? Farlo non è mai stato così facile!"}
                    redirectLink={"/aggiuntaPaziente"}
                    buttonText={"Andiamo!"}
                ></ImageBanner>
            </div>
        </div>
    );
};

export default ListaPazienti;
