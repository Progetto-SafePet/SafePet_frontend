import React from 'react';
import {Link} from "react-router-dom";
import "./ImageBanner.scss"

interface ImageBannerProps {
    imagePath: string;
    description: string;
    redirectLink?: string;
    buttonText?: string;
}

function ImageBanner ({imagePath, description, redirectLink, buttonText} : ImageBannerProps) {
    return (
            <div className="image-banner">
                {/* Sezione Immagine */}
                <div className="banner-image-wrapper">
                    <img src={imagePath} alt="Banner" className="banner-image" />
                </div>

                {/* Sezione Descrizione e Bottone */}
                <div className="banner-content">
                    <h2 className="banner-description">{description}</h2>

                    {/* Mostra il bottone solo se la prop 'button' è true */}
                    {redirectLink && ( // Controlliamo anche che ci sia un link
                        <Link to={redirectLink} className="button-primary"> {buttonText} </Link>
                    )}
                </div>
            </div>
    )
}

export default ImageBanner;

