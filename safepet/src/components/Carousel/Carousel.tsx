import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import {PromoCardProps} from "./PromoCard/PromoCard";
import PromoCard from "./PromoCard/PromoCard";
import "./Carousel.scss"

type CarouselProps = {
    cardsData : PromoCardProps[];
    arrows? : boolean;
    autoplay? : boolean;
    dots? : boolean;
}

const Carousel = ({
                      cardsData,
                      arrows = true,
                      autoplay = true,
                      dots = true} : CarouselProps
) => {
    const settings = {
        arrows: arrows,
        autoplay: autoplay,
        dots: dots,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplaySpeed: 3000,
        focusOnSelect: true,
        pauseOnHover: true,
        pauseOnDow: true,

        responsive: [
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    arrows: false,
                    slidesToShow: 1,
                    slidesToScroll: 1,
                }
            }
        ]
    };

    return (
        <div style={{padding: "40px" }}>
            <h2>Le nostre promozioni</h2>
            <Slider {...settings}>
                {cardsData.map((card : PromoCardProps, index: number) => (
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