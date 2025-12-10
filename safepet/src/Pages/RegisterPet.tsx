import Carousel from "../components/Carousel/Carousel";
import {useEffect, useState} from "react";

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
    const [sesso, setSesso] = useState("M");
    const [foto, setFoto] = useState(null);
    const [coloreMantello, setColoreMantello] = useState("");
    const [dataNascita, setDataNascita] = useState("");
    const [isSterilizzato, setIsSterilizzato] = useState(false);
    const [peso, setPeso] = useState("");
    const [errors, setErrors] = useState({});

    const TOKEN = localStorage.getItem("token");

    // Validazione
    function validate() {
        const newErrors = {};

        if (!nome.trim()) newErrors.nome = "Il nome del pet è obbligatorio";
        else if (nome.length < 3 || nome.length > 20)
            newErrors.nome = "Il nome deve contenere dai 3 caratteri ai 20 caratteri";

        if (!sesso) newErrors.sesso = "Il sesso del pet è obbligatorio";
        else if (!/^(M|F)$/.test(sesso))
            newErrors.sesso = "Il sesso deve essere 'MASCHIO' o 'FEMMINA'";


        if (!specie.trim()) {
            newErrors.specie = "La specie del pet è obbligatoria";
        } else if (!["cane", "gatto", "altro"].includes(specie)) {
            newErrors.specie = "La specie deve essere 'cane', 'gatto' o 'altro'";
        }

        if (razza && (razza.length < 3 || razza.length > 30))
            newErrors.razza = "La razza deve contenere dai 3 caratteri ai 30 caratteri";

        if (!dataNascita){
            newErrors.dataNascita = "La data di nascita del pet è obbligatoria";
        }else {
            const selectedDate = new Date(dataNascita);
            const today = new Date();
            // Azzera ore, minuti, secondi per confronto solo data
            selectedDate.setHours(0, 0, 0, 0);
            today.setHours(0, 0, 0, 0);

            if (selectedDate > today) {
                newErrors.dataNascita = "La data di nascita non può superare il giorno corrente";
            }
        }

        if (peso !== "") {
            const nPeso = Number(peso);
            if (nPeso < 0.1 || nPeso > 100)
                newErrors.peso = "Il peso deve essere compreso tra 0.1 e 100.0";
        }

        if (coloreMantello && (coloreMantello.length < 3 || coloreMantello.length > 15))
            newErrors.coloreMantello = "Il colore del mantello deve contenere dai 3 caratteri ai 15 caratteri";

        if (microchip) {
            if (!/^\d{15}$/.test(microchip)) {
                newErrors.microchip = "Il microchip deve contenere esattamente 15 cifre numeriche";
            }
        }
        if (foto) {
            const allowedTypes = ["image/png", "image/jpg"];
            if (!allowedTypes.includes(foto.type)) {
                newErrors.foto = "La foto deve essere in formato PNG o JPG";
            }
        }


        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    const creaPet = async (e) => {
        e.preventDefault();
        if (!validate()) return;

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
            const response = await fetch("/gestionePet/creaPet", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                },
                body: formData, // multipart
            });

            if (response.ok) {
                const data = await response.json();
                console.log(`Animale "${data.nome}" registrato con successo!`);
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
                console.log("Token non valido o scaduto.");
            } else {
                console.log("Errore durante la registrazione del pet.");
            }
        } catch (error) {
            console.log("Errore di connessione al server.");
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
                            />
                            {errors.nome && <div className="msg-error">{errors.nome} </div>}
                        </div>
                        <div className="form-group">
                            <label>Sesso</label>
                            <select
                                value={sesso}
                                onChange={(e) => setSesso(e.target.value)}
                            >
                                <option value="M">Maschio</option>
                                <option value="F">Femmina</option>
                            </select>
                            {errors.sesso && <div className="msg-error">{errors.sesso}</div>}
                        </div>

                        <div className="form-group">
                            <label>Specie</label>
                            <select
                                value={specie}
                                onChange={(e) => setSpecie(e.target.value)}
                            >
                                <option value="">Seleziona specie</option>
                                <option value="cane">Cane</option>
                                <option value="gatto">Gatto</option>
                                <option value="altro">Altro</option>
                            </select>
                            {errors.specie && <div className="msg-error">{errors.specie}</div>}
                        </div>

                        <div className="form-group">
                            <label>Razza</label>
                            <input
                                type="text"
                                value={razza}
                                onChange={(e) => setRazza(e.target.value)}
                            />
                            {errors.razza && <div className="msg-error">{errors.razza}</div>}
                        </div>

                        <div className="form-group">
                            <label>Peso</label>
                            <input
                                type="number"
                                value={peso}
                                min="0.1"
                                max="100"
                                step="0.1"
                                onChange={e => setPeso(e.target.value)}
                            />
                            {errors.peso && <div className="msg-error">{errors.peso}</div>}
                        </div>

                        <div className="form-group">
                            <label>Data di nascita</label>
                            <input
                                type="date"
                                value={dataNascita}
                                onChange={e => setDataNascita(e.target.value)}
                            />
                            {errors.dataNascita && <div className="msg-error">{errors.dataNascita}</div>}
                        </div>

                        <div className="form-group">
                            <label>Colore mantello</label>
                            <input
                                type="text"
                                value={coloreMantello}
                                onChange={(e) => setColoreMantello(e.target.value)}
                            />
                            {errors.coloreMantello && <div className="msg-error">{errors.coloreMantello}</div>}
                        </div>

                        <div className="form-group">
                            <label>Microchip</label>
                            <input
                                type="text"
                                value={microchip}
                                onChange={(e) => setMicrochip(e.target.value)}
                            />
                            {errors.microchip && <div className="msg-error">{errors.microchip}</div>}
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
                                accept=".png, .jpg"
                                onChange={(e) => setFoto(e.target.files[0])}
                            />
                            {errors.foto && <div className="msg-error">{errors.foto}</div>}
                        </div>

                        <button type="submit" className="button-primary">
                            Registra Pet
                        </button>
                    </form>

                    <Carousel cardsData={promoData} />
                </div>
            </div>
        </div>
    );
}

export default RegisterPet;
