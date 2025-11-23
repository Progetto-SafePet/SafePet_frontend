import {useEffect, useRef, useState} from "react";
import Title from "../components/Title/Title";

import "../css/InsertLinkingCode.scss"
import {Navigate, useNavigate} from "react-router-dom";
import BannerHomepage from "../components/BannerHomepage/BannerHomepage";
import ImageBanner from "../components/ImageBanner/ImageBanner";

function InsertLinkingCode() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const TOKEN = localStorage.getItem("token");

    const [values, setValues] = useState(Array(8).fill(""));
    const inputsRef = useRef([]);

    const handleChange = (e: InputEvent, index: number) => {
        let value = e.target.value;

        // Validazione: prime 3 lettere maiuscole
        if (index < 3) {
            value = value.replace(/[^A-Za-z]/g, "").toUpperCase();
        }
        else {
            value = value.replace(/[^0-9]/g, "");
        }

        const newValues = [...values];
        newValues[index] = value;
        setValues(newValues);

        if (value.length === 1 && index < 7) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e: KeyboardEvent, index: number) => {
        if (e.key === "Backspace" && values[index] === "" && index > 0) {
            inputsRef.current[index - 1].focus();
        }
    };

    const submit = async () => {
        const linkingCode = values.join("").trim();
        if (linkingCode.length != 8) {
            alert("Linking code non valido")
            throw new Error("Linking code non valido: " + linkingCode);
        }

        try {
            const response = await fetch("http://localhost:8080/gestionePaziente/aggiungiPaziente", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    linkingCode: linkingCode
                })
            });

            if (response.ok) {
                // const navigate = useNavigate();
                // navigate("/pazienti", { replace: true });
                return <Navigate to={"/pazienti"} replace={true} />
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

    const reset = () => {
        setValues(new Array(8).fill(""));
    }

    return (
        <div className="page-container">
            <BannerHomepage></BannerHomepage>
            <div className="page">
                <div className='main-container'>
                    <div className={"form banner-container"}>
                        <Title text={"Associa un pet tramite il suo linking code"} />

                        <div className="linking-code">
                            <p>Linking code:</p>
                            <div className="code">
                            {values.map((value, index) => (
                                <input
                                    key={index}
                                    ref={(el) => (inputsRef.current[index] = el)}
                                    value={value}
                                    maxLength={1}
                                    placeholder={index < 3 ? "A" : "0"}
                                    onChange={(e) => handleChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                />
                            ))}
                            </div>
                        </div>
                        <div className="buttons">
                            <button onClick={(() => reset())}>Reset</button>
                            <button onClick={(() => submit())}>Associa</button>
                        </div>
                    </div>

                    <ImageBanner
                        imagePath={"../imgs/qr-code-scanner.gif"}
                        description={"Associa un pet scannerizzando il QR code"}
                        redirectLink={"./"}
                        buttonText={"Scannerizza"}
                    ></ImageBanner>
                </div>
            </div>
        </div>
    );
}

export default InsertLinkingCode;