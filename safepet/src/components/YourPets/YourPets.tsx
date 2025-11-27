import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./YourPets.scss";
import Title from "../Title/Title";

const YourPets = () => {
  const [pets, setPets] = useState([]);

 const TOKEN = localStorage.getItem("token");

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await fetch("http://localhost:8080/gestionePet/visualizzaElencoPet", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setPets(data);
        } else if (response.status === 401) {
          console.log("Token non valido o scaduto.");
        } else {
          console.log("Errore durante il recupero dei tuoi animali.");
        }
      } catch (error) {
        console.error("Errore di connessione:", error);
        console.log("Errore di connessione al server.");
      }
    };

    fetchPets();
  }, []);

  return (
    <>
      <Title text="I tuoi pet"></Title>
      <div className="pet-container">
        {pets.length === 0 ? (
          <p className="no-pets">Nessun animale registrato.</p>
        ) : (
          pets.map((pet) => (
              <Link
                  key={pet.id}
                  to={`/dettaglioPet/${pet.id}`}
                  className="pet-card"
                  style={{ textDecoration: "none", color: "inherit" }}
              >

              <div key={pet.id} className="pet-card">
              <div className="pet-image">
                {pet.fotoBase64 ? (
                  <img
                    src={`data:image/jpeg;base64,${pet.fotoBase64}`}
                    alt={pet.nome}
                  />
                ) : (
                  <div className="placeholder">Nessuna immagine</div>
                )}
              </div>

              <div className="pet-content">
                <span className="pet-tag">{pet.sesso === "M" ? "Maschio" : "Femmina"}</span>
                <h3 className="pet-title">{pet.nome}</h3>
                <p className="pet-description">
                      <strong>Specie:</strong> {pet.specie} <br />
                      <strong>Data Nascita: </strong> {pet.dataNascita} <br />
                </p>
              </div>
            </div>
              </Link>
          ))
        )}
      </div>
    </>
  );
};

export default YourPets;
