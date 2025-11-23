import {useEffect, useRef, useState} from "react";
import Title from "../components/Title/Title";

import "../css/InsertLinkingCode.scss"

function InsertLinkingCode() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const [values, setValues] = useState(Array(8).fill(""));
    const inputsRef = useRef([]);

    const handleChange = (e, index) => {
        let value = e.target.value;

        // Validazione: prime 3 lettere maiuscole
        if (index < 3) {
            value = value.replace(/[^A-Za-z]/g, "").toUpperCase();
        }
        // Ultime 5 cifre
        else {
            value = value.replace(/[^0-9]/g, "");
        }

        const newValues = [...values];
        newValues[index] = value;
        setValues(newValues);

        // Avanza automaticamente quando il campo è pieno (1 carattere)
        if (value.length === 1 && index < 7) {
            inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && values[index] === "" && index > 0) {
            // Torna al campo precedente
            inputsRef.current[index - 1].focus();
        }
    };

    const stampa = () => {
        console.log(values.join(""))
    }

    const reset = () => {
        setValues(new Array(8).fill(""));
    }

    return (
        <div className="page-container">
            <div className="page">
                <div className='main-container'>
                    <div className={"form"}>
                        <Title text={"Inserisci il linking code"} />

                        <div className="linking-code">
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
                        <div className="buttons">
                            <button onClick={(() => reset())}>Reset</button>
                            <button onClick={() => (stampa())}>Stampa</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InsertLinkingCode;