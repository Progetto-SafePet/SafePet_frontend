import * as React from 'react';
import { useState } from 'react';
import './Navbar.scss';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ENV } from '../../env';
import { useUser } from '../../Contexts/UserProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faChevronDown } from '@fortawesome/free-solid-svg-icons';

function Navbar() {
  const [isVisibleLogin, setIsVisibleLogin] = useState(false);
  const [isVisibleSignup, setIsVisibleSignup] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  // LOGIN
  const [emailLogin, setEmailLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');

  // SIGNUP
  const [emailSignup, setEmailSignup] = useState('');
  const [passwordSignup, setPasswordSignup] = useState('');
  const [nomeSignup, setNomeSignup] = useState('');
  const [cognomeSignup, setCognomeSignup] = useState('');

  const location = useLocation();
  const { usernameGlobal, updateUser } = useUser();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  const toggleLogin = () => {
    if (isVisibleSignup) setIsVisibleSignup(false);
    setIsVisibleLogin(!isVisibleLogin);
  };

  const toggleSignUp = () => {
    if (isVisibleLogin) setIsVisibleLogin(false);
    setIsVisibleSignup(!isVisibleSignup);
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
        localStorage.setItem('userRole', data.role); //TODO

        updateUser(data.email, data.role);
        setIsVisibleLogin(false);
      } else {
        alert('Credenziali errate o utente non trovato.');
      }
    } catch (error) {
      alert('Errore di connessione al server.');
    }
  };

  // SIGNUP FETCH
  const signup = async () => {
    const newUser = {
      email: emailSignup,
      password: passwordSignup,
      nome: nomeSignup,
      cognome: cognomeSignup,
    };

    try {
      const response = await fetch('http://localhost:8080/auth/registraUtente', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        setIsVisibleSignup(false);
      } else {
        alert('Errore durante la registrazione. Verifica i dati e riprova.');
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
                <button className="button-primary" onClick={toggleLogin}>Login</button>
                <button className="button-primary" onClick={toggleSignUp}>Registrati</button>
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

      {/* SIGNUP MODAL */}
      {isVisibleSignup && (
        <div id="signup-box" className="login-box">
          <h2>Registrazione</h2>
          <form>
            <div className="user-box">
              <input type="text" value={nomeSignup} onChange={(e) => setNomeSignup(e.target.value)} required />
              <label>Nome</label>
            </div>
            <div className="user-box">
              <input type="text" value={cognomeSignup} onChange={(e) => setCognomeSignup(e.target.value)} required />
              <label>Cognome</label>
            </div>
            <div className="user-box">
              <input type="email" value={emailSignup} onChange={(e) => setEmailSignup(e.target.value)} required />
              <label>Email</label>
            </div>
            <div className="user-box">
              <input type="password" value={passwordSignup} onChange={(e) => setPasswordSignup(e.target.value)} required />
              <label>Password</label>
            </div>
            <div className="side-boxes-login">
              <button type="button" className="button-primary" onClick={signup}>Registrati</button>
              <button type="button" className="button-primary" onClick={toggleSignUp}>Chiudi</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default Navbar;
