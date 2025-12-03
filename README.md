# 🐾 SafePet_frontend
## 📚 Indice
* [Overview frontend](#overview-frontend)
  * [Obiettivi e Componenti Principali](#Obiettivi-e-Componenti-Principali)
  * [Funzionalità-visibili-agli-utenti](#Funzionalità-visibili-agli-utenti)
* [Tecnologie usate](#tecnologie-usate)
* [Avvio frontend](#Avvio-frontend)


## 💡Overview frontend
Il Frontend di SafePet funge da **Livello di Presentazione** del sistema, essendo il punto di contatto diretto con l'utente finale (Proprietari, Veterinari e Ospiti).
È sviluppato utilizzando **React**, integrato con **Vite.js** per garantire un'esperienza fluida e reattiva.

### Obiettivi e Componenti Principali
La responsabilità primaria del Frontend è gestire l'interazione tra l'utente e il sistema, assicurando chiarezza e rapidità d'uso.
* **Interfaccia Utente (GUI):** Questi componenti sono responsabili di visualizzare i dati provenienti dal backend, raccogliere l'input dell'utente (es. tramite form) e inoltrare le richieste al livello di logica applicativa tramite chiamate alle API REST.
* **Responsive UI:** L'interfaccia è progettata per adattarsi correttamente alle risoluzioni di diversi dispositivi, inclusi desktop, tablet e smartphone, garantendo l'accessibilità.

### Funzionalità Visibili all'Utente
Il Frontend visualizza e gestisce tutte le interazioni relative alle aree funzionali del sistema:
* **Profili Utente e Pet:** Schermate per la registrazione, il login, la visualizzazione dei profili e la gestione delle liste/dettagli dei Pet.
  * Generazione Codici: Interfacce per la generazione del **Linking Code** (codice temporaneo per l'associazione paziente)
  * Download PDF del libretto sanitario.
  * Permette di visualizzare l'elenco dei veterinari e i loro dettagli, e di interagire con i form per lasciare recensioni.
* **Strumenti di Emergenza:**
    * **Mappa Real Time:** Visualizzazione di una mappa interattiva (generata tramite **OpenStreetMap**) con un indicatore della posizione dell'utente e i marker delle cliniche veterinarie aperte nelle vicinanze, mostrando orari e recapiti di contatto.
    * **Analisi Dermatologica:** Schermata per caricare immagini del pet, che vengono inviate al **Modulo AI** per l'analisi e la restituzione di un esito preliminare e orientativo.

## ⚙️ Tecnologie usate
* React: Framework open-source basato su componenti per realizzare un'interfaccia utente altamente reattiva e modulare. 
* Vite.js (v. 5.2.0): Bundler moderno che velocizza l'ambiente di sviluppo e i tempi di build del front-end. 
* Canva: Strumento utilizzato per la realizzazione di mockup. 
* OpenStreetMap: Piattaforma open-source impiegata per la visualizzazione interattiva delle mappe nella funzione di localizzazione delle strutture veterinarie.

## 🎨 Avvio frontend

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

---

## 🔐 Account per utilizzo
| Email | Password       | Ruolo |
|:---|:---------------|:---|
| maria.rossi@example.com | `MariaR123`    | Proprietario |
| luca.bianchi@example.com | `LucaB1992`    | Proprietario |
| acmemoli@gmail.com | `ACMemoli.91`  | Veterinario |
| gamatruda2@gmail.com | `GAmatruda.93` | Veterinario |