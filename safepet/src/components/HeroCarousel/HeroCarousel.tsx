import React from "react";
import Slider from "react-slick";
import "./HeroCarousel.scss";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const HeroCarousel = ({ slides }) => {
  
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 5000,
    fade: true,
    speed: 1000,
    arrows: true,
    pauseOnHover: false,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    appendDots: dots => (
      <div className="hero-dots">
        <ul>{dots}</ul>
      </div>
    ),
    customPaging: i => <span className="dot"></span>
  };

  return (
    <div className="carousel-hero-banner">
      <Slider {...settings}>
        {slides.map((slide, i) => (
          <div key={i} className="carousel-slide">
            <img src={slide.image} alt={slide.title} />

            <div className="slide-content">
              <h1>{slide.title}</h1>
              <p>{slide.text}</p>
              {slide.cta && (
                <a href={slide.cta.href} className="button-primary">
                  {slide.cta.label}
                </a>
              )}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default HeroCarousel;

function NextArrow(props) {
  const { onClick } = props;
  return <div className="nav-button next" onClick={onClick}>&#10095;</div>;
}

function PrevArrow(props) {
  const { onClick } = props;
  return <div className="nav-button prev" onClick={onClick}>&#10094;</div>;
}
