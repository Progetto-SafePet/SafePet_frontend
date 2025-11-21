import React from "react";
import "./PromoCards.scss";

const PromoCards = ({ cards = [] }) => {
  return (
    <div className="promo-container">
      {cards.slice(0, 3).map((card, index) => (
        <div key={index} className="promo-card">
          <div className="promo-image">
            <img src={card.image} alt={card.title} />
          </div>

          <div className="promo-content">
            <span className="promo-tag">{card.tag}</span>
            <h3 className="promo-title">{card.title}</h3>
            <p className="promo-description">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PromoCards;
