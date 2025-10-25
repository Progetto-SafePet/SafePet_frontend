import { useContext, useEffect, useState } from "react";
import Banner from "../components/Banner/Banner";
import BannerHomepage from "../components/BannerHomepage/BannerHomepage";

function Home() {


    return (
        <>
            <div className="page-container">
                <BannerHomepage></BannerHomepage>
                <div className="page">
                                    
                    <div className='main-container'>

                        <Banner 
                            text="Registrati a SafePet per registrare il tuo pet e scoprire tutti i vantaggi"
                            buttonText="Registrati"
                            link = "/signup"
                        >
                        </Banner>

                         <Banner 
                            text="Accedi a SafePet per registrare il tuo pet e scoprire tutti i vantaggi"
                            buttonText="Registrati"
                            link = "/login"
                        >
                        </Banner>

                    </div>
                    
                </div>
            </div>
        </>

    )
}

export default Home;