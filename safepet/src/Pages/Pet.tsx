import { useContext, useEffect, useState } from "react";
import Banner from "../components/Banner/Banner";
import BannerHomepage from "../components/BannerHomepage/BannerHomepage";
import YourPets from "../components/YourPets/YourPets";

function Pet() {
    return (
        <>
            <div className="page-container">
                <div className="page">
                                    
                    <div className='main-container'>

                        <YourPets />

                        <Banner 
                            text="Registra il tuo pet per accedere ai vantaggi di SafePet"
                            buttonText="Registra Pet"
                            link = "/registerpet"
                        >
                        </Banner>

                    </div>
                    
                </div>
            </div>
        </>
    )
}

export default Pet;