import { useUser } from "../Contexts/UserProvider";
import Accordion from "../components/Accordion/Accordion";
import Banner from "../components/Banner/Banner";
import Carousel from "../components/Carousel/Carousel";
import ImageBanner from "../components/ImageBanner/ImageBanner";
import HeroCarousel from "../components/HeroCarousel/HeroCarousel";
import {CONSTANTS} from "../constants";

function Home() {

    const { usernameGlobal, role } = useUser();

    const faqs = [
        {
            question: "Come funziona il libretto sanitario digitale di SafePet?",
            answer:
            "SafePet centralizza tutte le informazioni cliniche dell’animale: vaccini, visite, terapie, referti e microchip. Il veterinario aggiorna i dati in tempo reale e il proprietario può consultarli da qualunque dispositivo in modo sicuro."
        },
        {
            question: "I dati sanitari del mio animale sono davvero protetti?",
            answer:
            "Sì. SafePet utilizza crittografia end-to-end, controlli di accesso basati sui ruoli e audit log per monitorare ogni operazione. Solo veterinari autorizzati e proprietari connessi possono visualizzare o modificare i dati."
        },
        {
            question: "I veterinari devono installare software aggiuntivi?",
            answer:
            "No. SafePet è completamente web-based: basta accedere con le proprie credenziali. Le strutture veterinarie possono integrarlo con i loro sistemi esistenti grazie alle API e all’interfaccia semplice."
        },
        {
            question: "Come posso registrare un nuovo animale sulla piattaforma?",
            answer:
            "Il proprietario inserisce i dati principali del pet: nome, razza, sesso, microchip, foto, peso e data di nascita. Successivamente può assegnare l’animale a un veterinario che potrà aggiornare cartella clinica e vaccini."
        },
        {
            question: "Posso condividere i dati del mio animale con altri veterinari o cliniche?",
            answer:
            "Sì. SafePet permette la condivisione sicura della cartella clinica con studi veterinari diversi, utile in caso di emergenze, visite specialistiche o cambio di veterinario, mantenendo sempre l’accesso sotto controllo del proprietario."
        },
        {
            question: "SafePet invia promemoria per vaccini e trattamenti?",
            answer:
            "Sì. Il sistema genera notifiche automatiche per richiami vaccinali, visite programmate, terapie in corso e scadenze importanti. Il proprietario può ricevere alert via app, email o dashboard."
        }
    ];

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

    const slides = [
        {
            image: "../imgs/dog-wj7msvc5kj9v6cyy.jpg",
            title: "La Salute del Tuo Pet, Sempre con Te",
            text: "Gestisci vaccini, terapie, visite e referti con un unico libretto sanitario digitale.",
            cta: { label: "Scopri i servizi", href: "/features/libretto" }
        },
        {
            image: "../imgs/pexels.jpeg",
            title: "Un Ecosistema Digitale per Veterinari",
            text: "Agenda smart, schede cliniche avanzate, integrazione con microchip e API per strutture veterinarie.",
            cta: { label: "Per le Strutture", href: "/ElencoVet" }
        }
    ];


    return (
        <>
            <div className="page-container">
                <HeroCarousel slides={slides} />
                <div className="page">
                    <div className='main-container'>
                        <Carousel cardsData={promoData} autoplay={false} />
                        {!usernameGlobal && (
                            <Banner
                                text="Registrati a SafePet per registrare il tuo pet e scoprire tutti i vantaggi"
                                buttonText="Registrati"
                                link = "/signup"
                            >
                            </Banner>
                         )}
                        {usernameGlobal && role === CONSTANTS.ROLE.VETERINARIO && (
                            <ImageBanner
                                imagePath={"../imgs/aggiungi-paziente.jpg"}
                                description={"Vuoi aggiungere un pet alla tua lista di pazienti? Farlo non è mai stato così facile!"}
                                redirectLink={"/aggiuntaPaziente"}
                                buttonText={"Andiamo!"}
                            ></ImageBanner>
                        )}

                        {(!usernameGlobal || role !== CONSTANTS.ROLE.VETERINARIO) && (
                            <ImageBanner
                            imagePath={"/imgs/use-map.jpg"}
                            description={"Il tuo pet sta male? Trova la clinica aperta più vicina a te grazie alla mappa real time"}
                            redirectLink={"/map"}
                            buttonText="Vai alla mappa"
                        />

                        <Accordion items={faqs} />
                        )}
                    </div>
                </div>

            </div>
        </>
    )
}

export default Home;


