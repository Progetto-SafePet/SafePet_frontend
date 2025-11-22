import React, { useEffect, useState } from "react";
import "../css/ListaPazienti.css";

type Paziente = {
  nome: string;
  specie: string;
  dataNascita: string;
  proprietario: string;
  sesso: string;
  fotoBase64?: string;
};

const ListaPazienti = () => {
  const [pazienti, setPazienti] = useState<Paziente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPazienti = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Token mancante, effettua di nuovo il login.");
          setLoading(false);
          return;
        }

        const response = await fetch("http://localhost:8080/gestionePaziente/listaPazienti", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 404) {
          // Veterinario senza pazienti
          setPazienti([]);
          setLoading(false);
          return;
        }

        if (!response.ok) {
          setError("Errore nel recupero dei pazienti.");
          setLoading(false);
          return;
        }

        const data = await response.json();
        setPazienti(data);
        setLoading(false);

      } catch (err) {
        setError("Errore del server.");
        setLoading(false);
      }
    };

    fetchPazienti();
  }, []);


  const formatDate = (d: string) => {
    if (!d) return "-";
    return new Date(d).toLocaleDateString("it-IT");
  };

  if (loading)
    return <p style={{ textAlign: "center", marginTop: "40px" }}>Caricamento pazienti...</p>;

  if (error)
    return <p style={{ textAlign: "center", color: "red" }}>{error}</p>;

  // ✅ NUOVO CONTROLLO: se non ci sono pazienti
  if (!loading && pazienti.length === 0) {
    return (
        <div className="pazienti-container">
          <h1 className="title">I tuoi pazienti</h1>

          <p style={{
            textAlign: "center",
            marginTop: "30px",
            fontSize: "18px",
            opacity: 0.7
          }}>
            Non hai ancora pazienti associati al tuo profilo.
          </p>
        </div>
    );
  }

  return (
      <div className="pazienti-container">
        <h1 className="title">I tuoi pazienti</h1>

        <div className="pazienti-list">
          {pazienti.map((p, index) => (
              <div key={index} className="paziente-card">

                {p.fotoBase64 ? (
                    <img
                        className="paziente-foto"
                        src={`data:image/jpeg;base64,${p.fotoBase64}`}
                        alt={p.nome}
                    />
                ) : (
                    <img
                        className="paziente-foto"
                        src="https://via.placeholder.com/120"
                        alt="placeholder"
                    />
                )}

                <h2>{p.nome}</h2>

                <p><strong>Specie:</strong> {p.specie}</p>
                <p><strong>Sesso:</strong> {p.sesso === "M" ? "Maschio" : "Femmina"}</p>
                <p><strong>Nascita:</strong> {formatDate(p.dataNascita)}</p>
                <p><strong>Proprietario:</strong> {p.proprietario}</p>

              </div>
          ))}
        </div>
      </div>
  );
};

export default ListaPazienti;
