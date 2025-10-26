import React, { useEffect, useState } from "react";
import "./YourPets.scss";

const YourPets = () => {
  const [pets, setPets] = useState([]);

  const TOKEN =
    "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJsdWNhLnJvc3NpQG1haWwuY29tIiwiaWF0IjoxNzYxNDcxNzU2LCJleHAiOjE3NjE0NzUzNTYsImVtYWlsIjoibHVjYS5yb3NzaUBtYWlsLmNvbSIsInJvbGUiOiJQUk9QUklFVEFSSU8iLCJpZCI6MX0.o29RBzDNmiDSi_XBde5iC62Blj5UMS9z6W8BMsVG9Ls";

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch("http://localhost:8080/gestionePet/visualizzaPet", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPets(data);
        } else if (response.status === 401) {
          alert("Token non valido o scaduto.");
        } else {
          alert("Errore durante il recupero dei tuoi animali.");
        }
      } catch (error) {
        console.error("Errore di connessione:", error);
        alert("Errore di connessione al server.");
      }
    };

    fetchPets();
  }, []);

  return (
    <div className="promo-container">
      {pets.length === 0 ? (
        <p className="no-pets">Nessun animale registrato.</p>
      ) : (
        pets.map((pet) => (
          <div key={pet.id} className="promo-card">
            <div className="promo-image">
              {pet.fotoBase64 ? (
                <img
                  src={`data:image/jpeg;base64,${pet.fotoBase64}`}
                  alt={pet.nome}
                />
              ) : (
                <div className="placeholder">Nessuna immagine</div>
              )}
            </div>

            <div className="promo-content">
              <span className="promo-tag">{pet.sesso === "M" ? "Maschio" : "Femmina"}</span>
              <h3 className="promo-title">{pet.nome}</h3>
              <p className="promo-description">
                <strong>Razza:</strong> {pet.razza} <br />
                <strong>Microchip:</strong> {pet.microchip}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default YourPets;
