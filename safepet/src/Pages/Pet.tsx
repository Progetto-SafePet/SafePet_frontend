import { useContext, useEffect, useState } from "react";
import Banner from "../components/Banner/Banner";
import BannerHomepage from "../components/BannerHomepage/BannerHomepage";
import PromoCards from "../components/PromoCards/PromoCards";
import YourPets from "../components/YourPets/YourPets";

function Pet() {

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
    ];


    return (
        <>
            <div className="page-container">
                <div className="page">
                                    
                    <div className='main-container'>

                        <YourPets />

                        <Banner 
                            text="Registra il tuo pet per accedere ai vantaggi di SafePet"
                            buttonText="Registra Pet"
                            link = "/registerPet"
                        >
                        </Banner>

                    </div>
                    
                </div>
            </div>
        </>

    )
}

export default Pet;