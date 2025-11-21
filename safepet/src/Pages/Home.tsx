import { useUser } from "../Contexts/UserProvider";
import Banner from "../components/Banner/Banner";
import BannerHomepage from "../components/BannerHomepage/BannerHomepage";
import Carousel from "../components/Carousel/Carousel";

function Home() {

    const { usernameGlobal } = useUser();

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


    return (
        <>
            <div className="page-container">
                <BannerHomepage></BannerHomepage>
                <div className="page">
                    <div className='main-container'>
                        <Carousel cardsData={promoData} />
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
            </div>
        </>
    )
}

export default Home;

