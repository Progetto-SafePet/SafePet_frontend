import * as React from 'react';
import { useState } from 'react';
import './Navbar.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../Contexts/UserProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faChevronDown } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  const [isVisibleLogin, setIsVisibleLogin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  // LOGIN
  const [emailLogin, setEmailLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');

  const { usernameGlobal, updateUser } = useUser();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const toggleLogin = () => {
    setIsVisibleLogin(!isVisibleLogin);
  };

  // LOGIN FETCH
  const login = async () => {
    const credentials = { email: emailLogin, password: passwordLogin };

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token || 'dummyToken');
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userRole', "USER"); //TODO

        updateUser(data.email, "USER");
        setIsVisibleLogin(false);
      } else {
        alert('Credenziali errate o utente non trovato.');
      }
    } catch (error) {
      alert('Errore di connessione al server.');
    }
  };

  const logOut = () => {
    updateUser('', '');
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  return (
    <>
      <header>
        <div className="navbar light-neutral-10">
          <div>
            <Link to="/">
              <img height={70} className="logo-img" src="../imgs/logo1v2.png" alt="Logo" />
            </Link>
          </div>

          <div className="hamburger-menu" onClick={toggleMenu}>
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} size="lg" />
          </div>

          <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            <div className="menu-item" onClick={() => toggleDropdown('safepet')}>
              <span>SafePet <FontAwesomeIcon icon={faChevronDown} /></span>
              {openDropdown === 'safepet' && (
                <div className="dropdown">
                  <Link to="/about">Chi siamo</Link>
                  <Link to="/careers">Lavora con noi</Link>
                  <Link to="/contact">Contatti</Link>
                  <Link to="/faq">FAQ</Link>
                </div>
              )}
            </div>

            <div className="menu-item" onClick={() => toggleDropdown('servizi')}>
              <span>Servizi <FontAwesomeIcon icon={faChevronDown} /></span>
              {openDropdown === 'servizi' && (
                <div className="dropdown">
                  <Link to="/emergenze">Gestione emergenze</Link>
                  <Link to="/prenotazioni">Prenotazioni veterinarie</Link>
                  <Link to="/libretto">Libretto sanitario digitale</Link>
                  <Link to="/mappa">Mappa veterinari</Link>
                </div>
              )}
            </div>

            <div className="menu-item" onClick={() => toggleDropdown('supporto')}>
              <span>Supporto <FontAwesomeIcon icon={faChevronDown} /></span>
              {openDropdown === 'supporto' && (
                <div className="dropdown">
                  <Link to="/privacy">Privacy e sicurezza</Link>
                  <Link to="/termini">Termini di servizio</Link>
                  <Link to="/cookie">Cookie Policy</Link>
                  <Link to="/accessibilita">Accessibilità</Link>
                </div>
              )}
            </div>

            {!usernameGlobal && (
              <>
                <a className="button-primary" onClick={toggleLogin}>Login</a>
                <Link to={"/signup"} className="button-primary" >Registrati</Link>
              </>
            )}
            {usernameGlobal && (
              <>
                <Link className="button-primary" to="/profile"> Profilo </Link>
                <Link className="button-primary" to="/pet"> I tuoi pet </Link>
                <Link to="/" className="button-primary" onClick={logOut}>Logout</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* LOGIN MODAL */}
      {isVisibleLogin && (
        <div id="login-box" className="login-box">
          <h2>Login</h2>
          <form>
            <div className="user-box">
              <input
                id="emailLogin"
                type="email"
                value={emailLogin}
                onChange={(e) => setEmailLogin(e.target.value)}
                required
              />
              <label>Email</label>
            </div>
            <div className="user-box">
              <input
                id="passwordLogin"
                type="password"
                value={passwordLogin}
                onChange={(e) => setPasswordLogin(e.target.value)}
                required
              />
              <label>Password</label>
            </div>
            <div className="side-boxes-login">
              <button type="button" className="button-primary" onClick={login}>Login</button>
              <button type="button" className="button-primary" onClick={toggleLogin}>Chiudi</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default Navbar;
