import React, { useState } from "react";
import { useParams } from "react-router-dom";
import "../css/AggiungiNota.css"; 

function AggiungiNota() {
    const { petId } = useParams();

    const [titolo, setTitolo] = useState("");
    const [descrizione, setDescrizione] = useState("");
    const [error, setError] = useState({});

    const TOKEN = localStorage.getItem("token");

    function validate() {
        const newErrors = {};

        if (!titolo.trim()) {
            newErrors.titolo = "Il titolo della nota è obbligatorio";
        } else if (titolo.length > 100) {
            newErrors.titolo = "Il titolo non può superare i 100 caratteri";
        }

        if (!descrizione.trim()) {
            newErrors.descrizione = "La descrizione della nota è obbligatoria";
        } else if (descrizione.length > 300) {
            newErrors.descrizione = "La descrizione non può superare i 300 caratteri";
        }

        if (!petId) {
            newErrors.petId = "ID del pet non disponibile. Impossibile salvare la nota.";
        }

        setError(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const creaNota = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        const payload = {
            titolo,
            descrizione,
            petId: Number(petId)
        };

        try {
            const response = await fetch(
                `http://localhost:8080/gestionePet/creaNota/${petId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${TOKEN}`,
                    },
                    body: JSON.stringify(payload),
                }
            );

            if (response.ok) {
                const data = await response.json();
                console.log(`Nota "${data.titolo}" creata con successo.`);

                setTitolo("");
                setDescrizione("");
                setError({});
            } else if (response.status === 401) {
                console.log("Token non valido o scaduto.");
            } else {
                console.log("Errore nella creazione della nota.");
            }
        } catch (error) {
            console.error("Errore di connessione al server:", error);
        }
    };

    return (
        <div className="page-container">
            <div className="page">
                <div className="main-container">
                    <h2 className="title">Aggiungi la tua nota</h2>

                    <form className="add-note-form" onSubmit={creaNota}>
                        <div className="form-group">
                            <label htmlFor="titolo">Titolo</label>
                            <input
                                id="titolo"
                                type="text"
                                value={titolo}
                                onChange={(e) => setTitolo(e.target.value)}
                                maxLength={100}
                                placeholder="Osservazione post-terapia"
                            />
                            {error.titolo && (
                                <div className="msg-error">{error.titolo}</div>
                            )}
                        </div>

                        <div className="form-group">
                            <label htmlFor="descrizione">Descrizione</label>
                            <textarea
                                id="descrizione"
                                value={descrizione}
                                onChange={(e) => setDescrizione(e.target.value)}
                                rows={5}
                                maxLength={300}
                                placeholder="Inserisci i dettagli dell'osservazione..."
                            />
                            <small className="char-count">
                                {descrizione.length}/300 caratteri
                            </small>
                            {error.descrizione && (
                                <div className="msg-error">{error.descrizione}</div>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="button-primary"
                            disabled={!petId}
                        >
                            Salva Nota
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default AggiungiNota;
