import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.scss';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-column">
          <h3>SafePet</h3>
          <ul>
            <li><Link to="/about">Chi siamo</Link></li>
            <li><Link to="https://github.com/Progetto-SafePet">Lavora con noi</Link></li>
            <li><Link to="/contact">Contatti</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Servizi</h3>
          <ul>
              <li><Link to="/ElencoVet">Elenco veterinari</Link></li>
              <li><Link to="/emergenze">Gestione emergenze</Link></li>
              <li><Link to="/prenotazioni">Prenotazioni veterinarie</Link></li>
              <li><Link to="/libretto">Libretto sanitario digitale</Link></li>
              <li><Link to="/mappa">Mappa veterinari</Link></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Supporto</h3>
          <ul>
            <li><Link to="/privacy">Privacy e sicurezza</Link></li>
            <li><Link to="/termini">Termini di servizio</Link></li>
            <li><Link to="/cookie">Informativa sui cookie</Link></li>
            <li><Link to="/accessibilita">Accessibilità</Link></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 SafePet – Tutti i diritti riservati</p>
      </div>
    </footer>
  );
}

export default Footer;
