import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ENV } from "../env";
import Title from "../components/Title/Title";
import "../css/ProfiloPropretario.scss";

interface PetInfo {
  id: number;
  nome: string;
  specie: string;
  dataNascita: string;
  peso: number | null;
  coloreMantello: string | null;
  isSterilizzato: boolean | null;
  razza: string | null;
  microchip: string | null;
  sesso: string;
  fotoBase64: string | null;
}

interface ProfiloProprietario {
  id: number;
  nome: string;
  cognome: string;
  email: string;
  numeroTelefono: string;
  dataNascita: string;
  genere: string;
  indirizzoDomicilio: string;
  pets: PetInfo[];
}

function ProfiloProprietario() {
  const navigate = useNavigate();
  const [profilo, setProfilo] = useState<ProfiloProprietario | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProfiloProprietario();
  }, []);

  const fetchProfiloProprietario = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(
        `${ENV.ENVIRONMENT}/gestioneUtente/visualizzaProfiloProprietario`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        setError("Non sei autenticato. Effettua il login.");
        setTimeout(() => navigate("/login"), 2000);
        return;
      }

      if (response.status === 403) {
        setError("Non hai l'autorizzazione per visualizzare questo profilo.");
        return;
      }

      if (!response.ok) {
        throw new Error("Errore nel caricamento del profilo");
      }

      const data = await response.json();
      setProfilo(data);
    } catch (err) {
      setError("Si è verificato un errore nel caricamento del profilo");
      console.error("Errore:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    try {
      const [year, month, day] = dateString.split("T")[0].split("-");
      return `${day}/${month}/${year}`;
    } catch (e) {
      return new Date(dateString).toLocaleDateString("it-IT");
    }
  };

  const handlePetClick = (petId: number) => {
    navigate(`/dettaglioPet/${petId}`);
  };

  if (loading || !profilo) {
    return (
      <div className="page-container">
        <div className="page">
          <div className="main-container">
            <p style={{ padding: "60px 20px", textAlign: "center", color: "#666" }}>
              {loading ? "Caricamento..." : "Nessun dato disponibile"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="page">
          <div className="main-container">
            <div className="error-message" style={{ 
              padding: "60px 20px", 
              textAlign: "center", 
              color: "#d32f2f",
              backgroundColor: "#ffebee",
              borderRadius: "8px",
              margin: "20px auto",
              maxWidth: "600px"
            }}>
              {error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="page-container">
        <div className="page">
          <div className="main-container">
            <Title text={`Profilo di ${profilo.nome} ${profilo.cognome}`} />

            <div className="profilo-info">
              <h2>Informazioni Personali</h2>
              <div className="profilo-info-grid">
                <div className="profilo-info-item">
                  <span className="profilo-info-label">Nome Completo</span>
                  <span className="profilo-info-value">{`${profilo.nome} ${profilo.cognome}`}</span>
                </div>

                <div className="profilo-info-item">
                  <span className="profilo-info-label">Email</span>
                  <span className="profilo-info-value">{profilo.email}</span>
                </div>
                
                <div className="profilo-info-item">
                  <span className="profilo-info-label">Telefono</span>
                  <span className="profilo-info-value">{profilo.numeroTelefono}</span>
                </div>
                
                <div className="profilo-info-item">
                  <span className="profilo-info-label">Data di Nascita</span>
                  <span className="profilo-info-value">{formatDate(profilo.dataNascita)}</span>
                </div>
                
                <div className="profilo-info-item">
                  <span className="profilo-info-label">Genere</span>
                  <span className="profilo-info-value">
                    {profilo.genere === "M" ? "Maschio" : "Femmina"}
                  </span>
                </div>
                
                <div className="profilo-info-item">
                  <span className="profilo-info-label">Indirizzo</span>
                  <span className="profilo-info-value">{profilo.indirizzoDomicilio}</span>
                </div>
              </div>
            </div>

            <Title text="I Miei Pet" />

            <div className="pet-container">
              {profilo.pets.length === 0 ? (
                <p className="no-pets">Nessun animale registrato.</p>
              ) : (
                profilo.pets.map((pet) => (
                  <div 
                    key={pet.id} 
                    className="pet-card"
                    onClick={() => handlePetClick(pet.id)}
                  >
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
                      <span className="pet-tag">
                        {pet.sesso === "M" ? "Maschio" : "Femmina"}
                      </span>
                      <h3 className="pet-title">{pet.nome}</h3>
                      <p className="pet-description">
                        <strong>Specie:</strong> {pet.specie} <br />
                        {pet.razza && (
                          <>
                            <strong>Razza:</strong> {pet.razza} <br />
                          </>
                        )}
                        <strong>Data Nascita:</strong> {formatDate(pet.dataNascita)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
}

export default ProfiloProprietario;
