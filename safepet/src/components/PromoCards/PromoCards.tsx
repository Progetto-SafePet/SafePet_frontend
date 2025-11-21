import React from "react";
import "../Carousel/PromoCard/PromoCard.tsx"
import "./PromoCards.scss";
import PromoCard from "../Carousel/PromoCard/PromoCard";

const PromoCards = ({ cards = []}) => {
  return (
      <>
        <div className="promo-container">
          {cards.slice(0, 3).map((card) => (
              <PromoCard title={card.title} image={card.image} tag={card.tag} description={card.description}/>
          ))}
        </div>
      </>
  );
};

export default PromoCards;
