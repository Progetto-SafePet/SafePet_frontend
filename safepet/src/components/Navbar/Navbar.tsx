import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import './Navbar.scss';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  const [passwordLogin] = useState('');

  // SIGNUP
  const [emailSignup, setEmailSignup] = useState('');
  const [passwordSignup, setPasswordSignup] = useState('');
  const [nomeSignup, setNomeSignup] = useState('');
  const [cognomeSignup, setCognomeSignup] = useState('');

  const location = useLocation();
  const { usernameGlobal, updateUser } = useUser();
  const navigate = useNavigate();

  const menuRef = useRef(null);

  // HAMBURGER MENU
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setOpenDropdown(null); // chiude i dropdown quando apro/chiudo hamburger
  };

  // DROPDOWN OPEN/CLOSE
  const toggleDropdown = (menu) => {
    setOpenDropdown(openDropdown === menu ? null : menu);
  };

  // CLICK OUTSIDE (desktop + mobile)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenDropdown(null);
        setIsMenuOpen(false); // chiude anche menu mobile
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

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
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', data.email);
        localStorage.setItem('userRole', data.role);

        updateUser(data.email, data.role);
        setIsVisibleLogin(false);
      } else {
        alert('Credenziali errate.');
      }
    } catch (error) {
      alert('Errore di connessione.');
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
        alert('Errore durante la registrazione.');
      }
    } catch (error) {
      alert('Errore di connessione.');
    }
  };

  const toggleLogin = () => {
    if (isVisibleSignup) setIsVisibleSignup(false);
    setIsVisibleLogin(!isVisibleLogin);
  };

  const toggleSignUp = () => {
    if (isVisibleLogin) setIsVisibleLogin(false);
    setIsVisibleSignup(!isVisibleSignup);
  };

  const logOut = () => {
    updateUser('', '');
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  // COMPONENTE
  return (
    <>
      <header>
        <div className="navbar light-neutral-10" ref={menuRef}>
          <div>
            <Link to="/">
              <img height={70} className="logo-img" src="../imgs/logo1v2.png" alt="Logo" />
            </Link>
          </div>

          {/* HAMBURGER */}
          <div className="hamburger-menu" onClick={toggleMenu}>
            <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} size="lg" />
          </div>

          {/* NAV MENU */}
          <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>

            {/* SAFEPET */}
            <div className="menu-item" onClick={() => toggleDropdown('safepet')}>
              <span>SafePet <FontAwesomeIcon icon={faChevronDown} /></span>

              {openDropdown === 'safepet' && (
                <div className="dropdown">
                  <Link to="/about" onClick={() => { setOpenDropdown(null); setIsMenuOpen(false); }}>Chi siamo</Link>
                  <Link to="/careers" onClick={() => { setOpenDropdown(null); setIsMenuOpen(false); }}>Lavora con noi</Link>
                  <Link to="/contact" onClick={() => { setOpenDropdown(null); setIsMenuOpen(false); }}>Contatti</Link>
                  <Link to="/faq" onClick={() => { setOpenDropdown(null); setIsMenuOpen(false); }}>FAQ</Link>
                </div>
              )}
            </div>

            {/* SERVIZI */}
            <div className="menu-item" onClick={() => toggleDropdown('servizi')}>
              <span>Servizi <FontAwesomeIcon icon={faChevronDown} /></span>

              {openDropdown === 'servizi' && (
                <div className="dropdown">
                    <Link to="/ElencoVet" onClick={() => { setOpenDropdown(null); setIsMenuOpen(false); }}>Elenco veterinari</Link>
                    <Link to="/emergenze" onClick={() => { setOpenDropdown(null); setIsMenuOpen(false); }}>Gestione emergenze</Link>
                    <Link to="/prenotazioni" onClick={() => { setOpenDropdown(null); setIsMenuOpen(false); }}>Prenotazioni veterinarie</Link>
                    <Link to="/libretto" onClick={() => { setOpenDropdown(null); setIsMenuOpen(false); }}>Libretto sanitario digitale</Link>
                    <Link to="/mappa" onClick={() => { setOpenDropdown(null); setIsMenuOpen(false); }}>Mappa veterinari</Link>
                </div>
              )}
            </div>

            {/* SUPPORTO */}
            <div className="menu-item" onClick={() => toggleDropdown('supporto')}>
              <span>Supporto <FontAwesomeIcon icon={faChevronDown} /></span>

              {openDropdown === 'supporto' && (
                <div className="dropdown">
                  <Link to="/privacy" onClick={() => { setOpenDropdown(null); setIsMenuOpen(false); }}>Privacy e sicurezza</Link>
                  <Link to="/termini" onClick={() => { setOpenDropdown(null); setIsMenuOpen(false); }}>Termini di servizio</Link>
                  <Link to="/cookie" onClick={() => { setOpenDropdown(null); setIsMenuOpen(false); }}>Cookie Policy</Link>
                  <Link to="/accessibilita" onClick={() => { setOpenDropdown(null); setIsMenuOpen(false); }}>Accessibilità</Link>
                </div>
              )}
            </div>

            {/* LOGIN AREA */}
            {!usernameGlobal && (
              <>
                <button className="button-primary" onClick={toggleLogin}>Login</button>
                <button className="button-primary" onClick={toggleSignUp}>Registrati</button>
              </>
            )}

            {usernameGlobal && (
              <>
                <Link className="button-primary" to="/profile" onClick={() => { setOpenDropdown(null); setIsMenuOpen(false); }}>Profilo</Link>
                <Link className="button-primary" to="/pet" onClick={() => { setOpenDropdown(null); setIsMenuOpen(false); }}>I tuoi pet</Link>
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
              <input id="emailLogin" type="email" value={emailLogin} onChange={(e) => setEmailLogin(e.target.value)} required />
              <label>Email</label>
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
