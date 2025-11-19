import { useState } from "react";
import PromoCards from "../components/PromoCards/PromoCards";

function RegisterPet() {
  const promoData = [
    {
      image:
        "https://images.wagwalkingweb.com/media/daily_wag/blog_articles/hero/1723114015.705158/popular-dogs-hero-1.jpg",
      tag: "GESTIONE DIGITALE",
      title: "Libretto sanitario digitale",
      description:
        "Con SafePet hai un unico libretto sanitario digitale per ogni animale domestico. Tutte le informazioni veterinarie, i vaccini e le terapie sono centralizzati, sempre accessibili e aggiornati in tempo reale.",
    },
    {
      image:
        "https://brownvethospital.com/wp-content/uploads/2024/02/when-do-dogs-stop-growing.jpg",
      tag: "INTEGRAZIONE VETERINARIA",
      title: "Collaborazione tra veterinari e strutture",
      description:
        "SafePet connette cliniche, ambulatori e medici veterinari in un’unica rete digitale. La piattaforma facilita la condivisione sicura dei dati, riducendo tempi di diagnosi e migliorando la qualità delle cure.",
    },
    {
      image:
        "https://d3544la1u8djza.cloudfront.net/APHI/Blog/2023/September/small-breeds-hero.jpg",
      tag: "EMERGENZE INTELLIGENTI",
      title: "QR Code e interventi rapidi",
      description:
        "Ogni animale iscritto dispone di un QR Code identificativo: in caso di emergenza, veterinari o soccorritori possono accedere immediatamente alla sua scheda clinica per un intervento tempestivo e sicuro.",
    },
  ];

  const [nome, setNome] = useState("");
  const [sesso, setSesso] = useState("F");
  const [specie, setSpecie] = useState("");
  const [razza, setRazza] = useState("");
  const [dataNascita, setDataNascita] = useState("");
  const [peso, setPeso] = useState(0.0);
  const [coloreMantello, setColoreMantello] = useState("Nero");
  const [microchip, setMicrochip] = useState("");
  const [isSterilizzato, setIsSterilizzato] = useState(false);
  const [foto, setFoto] = useState(null);

  const TOKEN = localStorage.getItem("token");

  const creaPet = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("nome", nome);
    formData.append("razza", razza);
    formData.append("microchip", microchip);
    formData.append("sesso", sesso);
    formData.append("specie", specie);
    formData.append("dataNascita", dataNascita);
    formData.append("coloreMantello", coloreMantello);
    formData.append("sterilizzato", isSterilizzato ? "true" : "false");
    formData.append("peso", peso);
    formData.append("foto", foto);

    console.log(coloreMantello)

    try {
      const response = await fetch("http://localhost:8080/gestionePet/creaPet", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`, 
        },
        body: formData, 
      });

      if (response.ok) {
        const data = await response.json();
        console.log(`Animale "${data.nome}" registrato con successo!`);
        console.log("Pet creato:", data);

        setNome("");
        setRazza("");
        setMicrochip("");
        setSesso("F");
        setFoto(null);
        e.target.reset();
      } else if (response.status === 401) {
        console.log("Token non valido o scaduto.");
      } else {
        console.log("Errore durante la registrazione del pet.");
      }
    } catch (error) {
      console.log("Errore di connessione al server.");
      console.error(error);
    }
  }

  return (
      <>
         <div className="page-container">
          <div className="page">
            <div className="main-container">
              <h2 className="title">Registra il tuo animale</h2>

              <form
                className="register-pet-form"
                onSubmit={creaPet}
                encType="multipart/form-data"
              >
                <div className="form-group">
                  <label>Nome</label>
                  <input
                    type="text"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Sesso</label>
                  <select
                    value={sesso}
                    onChange={(e) => setSesso(e.target.value)}
                    required
                  >
                    <option value="M">Maschio</option>
                    <option value="F">Femmina</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Colore Mantello</label>
                  <select
                    value={coloreMantello}
                    onChange={(e) => setColoreMantello(e.target.value)}
                    required
                  >
                    <option value="Nero">Nero</option>
                    <option value="Marrone">Marrone</option>
                    <option value="Blu">Blu</option>
                    <option value="Bianco">Bianco</option>
                    <option value="Grigio">Grigio</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Specie</label>
                  <input
                    type="text"
                    value={specie}
                    onChange={(e) => setSpecie(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Razza</label>
                  <input
                    type="text"
                    value={razza}
                    onChange={(e) => setRazza(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Microchip</label>
                  <input
                    type="text"
                    value={microchip}
                    onChange={(e) => setMicrochip(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Data di nasciata</label>
                  <input
                    type="date"
                    value={dataNascita}
                    onChange={(e) => setDataNascita(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Sterilizzato</label>
                  <input
                    type="checkbox"
                    checked={isSterilizzato}
                    onChange={(e) => setIsSterilizzato(e.target.checked)}
                  />
                </div>

                <div className="form-group">
                  <label>Foto</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFoto(e.target.files[0])}
                    required
                  />
                </div>

                <button type="submit" className="button-primary">
                  Registra Pet
                </button>
              </form>

              <PromoCards cards={promoData} />
            </div>
          </div>
        </div>
      </>
  );

}

export default RegisterPet;
