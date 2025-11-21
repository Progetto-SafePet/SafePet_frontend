import React, { useEffect, useState } from "react";
import "./YourPets.scss";

const YourPets = () => {
  const [pets, setPets] = useState([]);

 const TOKEN = localStorage.getItem("token");

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
                    <strong>Specie:</strong> {pet.specie} <br />
                    <strong>Data Nascita: </strong> {pet.dataNascita} <br />
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default YourPets;
