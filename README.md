# SafePet_backend
La **disponibilità immediata di informazioni cliniche aggiornate** è **cruciale** per interventi tempestivi
ed efficaci sugli animali da compagnia, specialmente in **emergenze** (incidenti, allergie, intossicazioni, calamità naturali).
La rapidità di accesso a dati come patologie pregresse, terapie e allergie può essere **vitale**.
Il progetto **SafePet** è una piattaforma digitale che mira a:

* **Digitalizzare e Centralizzare i dati:** Superare la gestione cartacea e frammentata.
* **Garantire l'Immediata Disponibilità:** Assicurare che le informazioni cliniche essenziali siano disponibili in **ogni situazione di emergenza**.
* **Favorire la Cooperazione:** Semplificare la **condivisione sicura** delle informazioni tra proprietari e veterinari.
* **Potenziare la Risposta alle Emergenze:** Migliorare la capacità di risposta alle crisi veterinarie e sanitarie integrate.
* **Promuovere una Gestione Moderna:** Sostenere una sanità veterinaria più resiliente e le politiche nazionali di prevenzione e benessere animale.

---

### Partecipanti
| Nome                 | Cognome   | Ruolo           |
|:---------------------|:----------|:----------------|
| Francesco Alessandro | Pinto     | Project Manager |
| Francesco Maria      | Torino    | Project Manager |
| Aldo                 | Adinolfi  | Team Member     |
| Gianmarco            | Amatruda  | Team Member     |
| Simone               | Cimmino   | Team Member     |
| Matteo Ferdinando    | Emolo     | Team Member     |
| Anna Chiara          | Memoli    | Team Member     |
| Chiara               | Memoli    | Team Member     |
| Vincenzo Giuseppe    | Nappi     | Team Member     |
| Giuseppe             | Rossano   | Team Member     |
| Rosario              | Saggese   | Team Member     |
| Luca                 | Salvatore | Team Member     |
| Morgan               | Vitiello  | Team Member     |

---

### Installazione ed esecuzione

---

### Prerequisiti
* Node.js (22.16.0)
* Java JDK 21.0.8
* Apache Maven 3.9.11
* Docker 4.51.0
* Intellij IDEA 2025.2.5 (per il backend)
* WebStorm IDEA 2025.2.5 (per il frontend)

---

### Installazione Maven
Per installare maven su sistema Windows è necessario aver già installato Java Development Kit (JDK)
ed aver configurato la variabile d'ambiente JAVA_HOME.

Dopodichè è necessario seguire i seguenti passaggi:
1. Scaricare apache-maven-3.9.11-bin.zip dalla seguente pagina: https://maven.apache.org/download.cgi
2. Effettuare l'unzip del file scaricato al passo uno all'interno di una qualsiasi directory (preferibilmente in Program Files)
3. Aggiungere la directory della cartella bin (contenuta nella cartella estratta al passo 2) alla variabile d'ambiente PATH
4. Verificare se l'installazione è andata a buon fine utilizzando il comando  mvn -v  all`interno di una nuova shell

---

### Backend

Per eseguire il backend è necessario seguire i seguenti passaggi:
1.  **Avviare Intellij** e clonare la repository del progetto:
    * `https://github.com/Progetto-SafePet/SafePet_backend.git`
2.  **Aprire Docker**.
3.  Tramite il terminale di Intellij digitare:
    * `docker compose up -d`
4.  Eseguire `clean` e `install` di Maven.
5.  Runnare `BackendApplication.java`.

---

### Frontend

Per eseguire il frontend è necessario seguire i seguenti passaggi:

1.  **Avviare WebStorm** e clonare la repository del progetto:
    * `https://github.com/Progetto-SafePet/SafePet_frontend.git`
2.  Tramite il terminale di WebStorm digitare:
    * `cd safapet`
3.  Digitare il comando per installare le dipendenze:
    * `npm install`
4.  Digitare il comando per avviare lo sviluppo:
    * `npm run dev`
5.  Selezionare l'indirizzo per visualizzare l'applicazione:
    * `http://localhost:5173/`