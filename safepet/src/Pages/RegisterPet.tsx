import {useEffect, useState} from "react";
import PromoCards from "../components/PromoCards/PromoCards";

function RegisterPet() {

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

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
    const [specie, setSpecie] = useState("");
    const [razza, setRazza] = useState("");
    const [microchip, setMicrochip] = useState("");
    const [sesso, setSesso] = useState("F");
    const [foto, setFoto] = useState(null);
    const [coloreMantello, setColoreMantello] = useState("");
    const [dataNascita, setDataNascita] = useState("");
    const [isSterilizzato, setIsSterilizzato] = useState(false);
    const [peso, setPeso] = useState("");

    const TOKEN = localStorage.getItem("token");

    const creaPet = async (e) => {
        e.preventDefault();

        // Trasforma stringhe vuote in null per i campi opzionali
        const razzaVal = razza.trim() === "" ? null : razza;
        const coloreMantelloVal = coloreMantello.trim() === "" ? null : coloreMantello;
        const microchipVal = microchip.trim() === "" ? null : microchip;

        const formData = new FormData();
        formData.append("nome", nome);
        formData.append("sesso", sesso);
        formData.append("specie", specie);
        if (razzaVal !== null) formData.append("razza", razzaVal);
        formData.append("dataNascita", dataNascita);
        if (peso !== "") formData.append("peso", peso);
        if (coloreMantelloVal !== null) formData.append("coloreMantello", coloreMantelloVal);
        formData.append("isSterilizzato", isSterilizzato);
        if (microchipVal !== null) formData.append("microchip", microchipVal);
        if (foto) {  // allega solo se esiste
            formData.append("foto", foto);
        }

        try {
            const response = await fetch("http://localhost:8080/gestionePet/creaPet", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
                body: formData, // multipart
            });

            if (response.ok) {
                const data = await response.json();
                alert(`Animale "${data.nome}" registrato con successo!`);
                console.log("Pet creato:", data);

                setNome("");
                setRazza("");
                setMicrochip("");
                setSesso("M");
                setFoto(null);
                setSpecie("");
                setDataNascita("");
                setPeso("");
                setColoreMantello("");
                setIsSterilizzato(false);
                e.target.reset();
            } else if (response.status === 401) {
                alert("Token non valido o scaduto.");
            } else {
                alert("Errore durante la registrazione del pet.");
            }
        } catch (error) {
            alert("Errore di connessione al server.");
            console.error(error);
        }
    };

    return (
        <div className="page-container">
            <div className="page">
                <div className="main-container">
                    <h2 className="title">Registra il tuo pet</h2>

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
                            />
                        </div>

                        <div className="form-group">
                            <label>Peso</label>
                            <input
                                type="number"
                                value={peso}
                                min="0"
                                max="100"
                                step="0.1"
                                onChange={e => setPeso(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Data di nascita</label>
                            <input
                                type="date"
                                value={dataNascita}
                                onChange={e => setDataNascita(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label>Colore mantello</label>
                            <input
                                type="text"
                                value={coloreMantello}
                                onChange={(e) => setColoreMantello(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Microchip</label>
                            <input
                                type="text"
                                value={microchip}
                                onChange={(e) => setMicrochip(e.target.value)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Sterilizzato</label>
                            <input
                                type="checkbox"
                                checked={isSterilizzato}
                                onChange={e => setIsSterilizzato(e.target.checked)}
                            />
                        </div>

                        <div className="form-group">
                            <label>Foto</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFoto(e.target.files[0])}
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
    );
}

export default RegisterPet;
