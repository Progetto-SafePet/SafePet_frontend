import React from 'react';
import Slider from "react-slick";

// Importa i file CSS obbligatori
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./Carousel.scss"

// Immaginiamo che il tuo componente sia qui
import PromoCard from "./PromoCard/PromoCard";

const Carousel = ({ cardsData }) => {
    const settings = {
        dots: true,
        infinite: true,
        arrows: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 3000,

        responsive: [
            {
                breakpoint: 1024,    // Tablet / Laptop piccoli
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,     // Mobile
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };

    return (
        <div style={{padding: "40px", maxWidth: "1200px" }}>
            <h2>Le nostre promozioni</h2>
            <Slider {...settings}>
                {cardsData.map((card, index: string) => (
                    // IMPORTANTE: Slick ha bisogno di un div wrapper per gestire bene il padding
                    <div key={index} style={{ padding: "0 8px", height: "100%" }}>
                        <PromoCard
                            title={card.title}
                            image={card.image}
                            tag={card.tag}
                            description={card.description}
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
}

export default Carousel;