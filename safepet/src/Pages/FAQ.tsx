import Accordion from "../components/Accordion/Accordion";
import BannerHomepage from "../components/BannerHomepage/BannerHomepage";
import Carousel from "../components/Carousel/Carousel";
import Title from "../components/Title/Title";


function FAQ() {

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

    const faqs = [
        {
            question: "Come funziona il libretto sanitario digitale?",
            answer:
            "SafePet centralizza visite, vaccini, terapie, documenti e referti in un’unica cartella clinica digitale sempre accessibile."
        },
        {
            question: "SafePet è conforme alle normative sulla privacy (GDPR)?",
            answer:
            "Sì. I dati sono trattati secondo GDPR, con protocolli di sicurezza, minimizzazione dei dati e controlli di accesso basati sui ruoli."
        },
        {
            question: "I veterinari possono aggiornare i dati in tempo reale?",
            answer:
            "Certo. Le modifiche vengono sincronizzate istantaneamente su tutti i dispositivi collegati."
        },
        {
            question: "Posso cambiare veterinario ma mantenere i dati del mio animale?",
            answer:
            "Sì. Il proprietario può autorizzare un nuovo veterinario mantenendo la piena proprietà e il pieno controllo dei dati."
        },
        {
            question: "Cosa succede se un veterinario non usa SafePet?",
            answer:
            "Puoi comunque registrare manualmente i dati principali del tuo animale e condividerli tramite report PDF o link sicuri."
        },
        {
            question: "Come vengono gestite le emergenze veterinarie?",
            answer:
            "Puoi condividere temporaneamente la cartella clinica con cliniche d’emergenza tramite link sicuro e accesso a tempo limitato."
        },
        {
            question: "Posso caricare documenti e analisi?",
            answer:
            "Sì. SafePet consente di caricare referti, radiografie, certificati e allegati in vari formati direttamente nella cartella clinica."
        },
        {
            question: "SafePet funziona anche per più animali?",
            answer:
            "Certo. Puoi gestire più animali all’interno dello stesso profilo proprietario in modo semplice e organizzato."
        },
        {
            question: "Come funziona la gestione dei vaccini?",
            answer:
            "Riceverai notifiche automatiche per richiami vaccinali, scadenze e nuove prescrizioni inserite dal veterinario."
        },
        {
            question: "I veterinari possono vedere i dati sensibili del proprietario?",
            answer:
            "No. Il veterinario vede solo dati clinici e anagrafici dell’animale, non informazioni personali non necessarie."
        },
        {
            question: "Posso esportare i dati del mio animale?",
            answer:
            "Sì. Puoi scaricare un report completo in PDF o condividere l’accesso tramite link sicuro generato dalla piattaforma."
        },
        {
            question: "SafePet supporta più dispositivi?",
            answer:
            "Sì. Puoi accedere da smartphone, tablet o computer senza installare applicazioni aggiuntive."
        },
        {
            question: "È possibile monitorare peso e parametri dell’animale?",
            answer:
            "Sì. Puoi registrare peso, caratteristiche fisiche e note per monitorare l’evoluzione dello stato di salute del tuo animale."
        },
        {
            question: "I veterinari hanno strumenti avanzati per la gestione dei pazienti?",
            answer:
            "Sì. SafePet include dashboard per monitorare pazienti, vaccini, appuntamenti imminenti e storico clinico completo."
        },
        {
            question: "I proprietari ricevono avvisi delle visite programmate?",
            answer:
            "Sì. Il sistema invia notifiche per appuntamenti, terapie, controlli veterinari e scadenze mediche."
        },
        {
            question: "Posso vedere quali veterinari hanno avuto accesso ai dati del mio animale?",
            answer:
            "Sì. Tramite audit log puoi visualizzare chi ha consultato o aggiornato la cartella clinica."
        },
        {
            question: "I dati vengono salvati su cloud?",
            answer:
            "Sì. Tutti i dati sono conservati su server sicuri con backup ridondati e sistemi di protezione avanzata."
        },
        {
            question: "È possibile integrare SafePet con software veterinari preesistenti?",
            answer:
            "Sì. SafePet offre API che consentono l’integrazione con gestionali e sistemi già utilizzati nelle cliniche."
        },
        {
            question: "Posso modificare o correggere i dati del mio animale?",
            answer:
            "Puoi modificare i dati anagrafici come nome, razza, peso e foto. Le informazioni cliniche possono essere aggiornate solo dai veterinari."
        },
        {
            question: "Cosa succede se elimino il mio account?",
            answer:
            "I tuoi dati vengono rimossi in modo sicuro. Puoi richiedere l’esportazione completa della cartella prima dell’eliminazione."
        }
    ];


    return (
        <>
            <div className="page-container">
                <BannerHomepage></BannerHomepage>
                <div className="page">
                    <div className='main-container'>
                        <Title text="FAQ"></Title>

                        <Accordion items={faqs} />

                        <Carousel cardsData={promoData} />

                    </div>
                </div>

            </div>
        </>
    )
}

export default FAQ;

