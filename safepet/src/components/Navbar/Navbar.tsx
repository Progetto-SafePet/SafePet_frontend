import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import './Navbar.scss';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../../Contexts/UserProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { CONSTANTS } from '../../constants';

function Navbar() {
  const [isVisibleLogin, setIsVisibleLogin] = useState(false);
  const [isVisibleSignup, setIsVisibleSignup] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [errorsLogin, setErrorsLogin] = useState({});
  const [errorsSignUp, setErrorsSignUp] = useState({});

  // LOGIN
  const [emailLogin, setEmailLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');

  // SIGNUP
  const [emailSignup, setEmailSignup] = useState('');
  const [passwordSignup, setPasswordSignup] = useState('');
  const [nomeSignup, setNomeSignup] = useState('');
  const [cognomeSignup, setCognomeSignup] = useState('');
  const [confermaPasswordSignup, setConfermaPasswordSignup] = useState('');
  const [numeroTelefonoSignup, setNumeroTelefonoSignup] = useState('');
  const [dataNascitaSignup, setDataNascitaSignup] = useState('');
  const [indirizzoDomicilioSignup, setIndirizzoDomicilioSignup] = useState('');
  const [genereSignup, setGenereSignup] = useState('');

  const location = useLocation();
  const { usernameGlobal, updateUser } = useUser();
  const navigate = useNavigate();

  const menuRef = useRef(null);

  const [role, setRole] = useState('');

  // HAMBURGER MENU
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    setOpenDropdown(null); // chiude i dropdown quando apro/chiudo hamburger
  };

  // DROPDOWN OPEN/CLOSE
  const toggleDropdown = (menu: string) => {
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

  // BLOCCA SCROLL QUANDO MODAL APERTO
  useEffect(() => {
    if (isVisibleLogin || isVisibleSignup) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isVisibleLogin, isVisibleSignup]);

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
        setRole(data.role);

        updateUser(data.email, data.role);
        setIsVisibleLogin(false);
      } else {
        console.log('Credenziali errate.');
      }
    } catch (error) {
      console.log('Errore di connessione.');
    }
  };

  // SIGNUP FETCH
  const signup = async () => {
    const newUser = {
      email: emailSignup,
      password: passwordSignup,
      confermaPassword: confermaPasswordSignup,
      nome: nomeSignup,
      cognome: cognomeSignup,
      numeroTelefono: numeroTelefonoSignup,
      dataNascita: dataNascitaSignup,
      indirizzoDomicilio: indirizzoDomicilioSignup,
      genere: genereSignup,
    };

    try {
      const response = await fetch('http://localhost:8080/gestioneUtente/registraProprietario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        setIsVisibleSignup(false);
      } else {
        console.log('Errore durante la registrazione.');
      }
    } catch (error) {
      console.log('Errore di connessione.');
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

  function validateLogin() {
    const newErrors: any = {};

    // Email
    if (!emailLogin.trim()) newErrors.emailLogin = "L'email è obbligatoria";
    else if (!/^\S+@\S+\.\S+$/.test(emailLogin))
      newErrors.emailLogin = "Formato email non valido";

    // Password
    if (!passwordLogin.trim()) newErrors.passwordLogin = "La password è obbligatoria";
    else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(passwordLogin))
      newErrors.passwordLogin =
        "Minimo 8 caratteri, almeno una maiuscola, una minuscola e un numero";

    setErrorsLogin(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function validateSignup() {
    const newErrors: any = {};

    // Nome
    if (!nomeSignup.trim()) newErrors.nomeSignup = "Il nome è obbligatorio";
    else if (nomeSignup.length < 2 || nomeSignup.length > 50)
      newErrors.nomeSignup = "Il nome deve essere tra 2 e 50 caratteri";

    // Cognome
    if (!cognomeSignup.trim()) newErrors.cognomeSignup = "Il cognome è obbligatorio";
    else if (cognomeSignup.length < 2 || cognomeSignup.length > 50)
      newErrors.cognomeSignup = "Il cognome deve essere tra 2 e 50 caratteri";

    // Data di nascita
    if (!dataNascitaSignup.trim())
      newErrors.dataNascitaSignup = "La data di nascita è obbligatoria";

    // Genere
    if (!genereSignup.trim())
      newErrors.genereSignup = "Il genere è obbligatorio";

    // Indirizzo
    if (!indirizzoDomicilioSignup.trim())
      newErrors.indirizzoDomicilioSignup = "L'indirizzo è obbligatorio";
    else if (indirizzoDomicilioSignup.length < 5 || indirizzoDomicilioSignup.length > 100)
      newErrors.indirizzoDomicilioSignup =
        "L'indirizzo deve essere tra 5 e 100 caratteri";

    // Telefono
    if (!numeroTelefonoSignup.trim())
      newErrors.numeroTelefonoSignup = "Il numero di telefono è obbligatorio";
    else if (!/^\d{10}$/.test(numeroTelefonoSignup))
      newErrors.numeroTelefonoSignup = "Il numero deve contenere esattamente 10 cifre";

    // Email
    if (!emailSignup.trim()) newErrors.emailSignup = "L'email è obbligatoria";
    else if (!/^\S+@\S+\.\S+$/.test(emailSignup))
      newErrors.emailSignup = "Formato email non valido";

    // Password
    if (!passwordSignup.trim())
      newErrors.passwordSignup = "La password è obbligatoria";
    else if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).{8,}$/.test(passwordSignup))
      newErrors.passwordSignup =
        "Minimo 8 caratteri, almeno una maiuscola, una minuscola e un numero";

    // Conferma Password
    if (!confermaPasswordSignup.trim())
      newErrors.confermaPasswordSignup = "Conferma password obbligatoria";
    else if (passwordSignup !== confermaPasswordSignup)
      newErrors.confermaPasswordSignup = "Le password non coincidono";

    setErrorsSignUp(newErrors);
    return Object.keys(newErrors).length === 0;
  }



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
                  <Link to="/veterinario/1" onClick={() => { setOpenDropdown(null); setIsMenuOpen(false); }}>FAQ</Link>
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
                {role === CONSTANTS.ROLE.PROPRIETARIO && (
                  <Link className="button-primary" to="/pet" onClick={() => { setOpenDropdown(null); setIsMenuOpen(false); }} > I tuoi pet </Link>
                )}

                {role === CONSTANTS.ROLE.VETERINARIO && (
                  <Link
                    className="button-primary"
                    to="/pazienti"
                    onClick={() => {
                      setOpenDropdown(null);
                      setIsMenuOpen(false);
                    }}
                  >
                    I tuoi pazienti
                  </Link>
                )}
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
          <form onSubmit={(e) => { e.preventDefault(); if (validateLogin()) login(); }}>

            <div className="user-box">
              <input
                id="emailLogin"
                type="email"
                value={emailLogin}
                onChange={(e) => setEmailLogin(e.target.value)}
                placeholder=" "
              />
              <label>Email</label>

              {errorsLogin.emailLogin && (
                <div className="msg-error">{errorsLogin.emailLogin}</div>
              )}
            </div>

            <div className="user-box">
              <input
                id="passwordLogin"
                type="password"
                value={passwordLogin}
                onChange={(e) => setPasswordLogin(e.target.value)}
                placeholder=" "
              />
              <label>Password</label>

              {errorsLogin.passwordLogin && (
                <div className="msg-error">{errorsLogin.passwordLogin}</div>
              )}
            </div>

            <div className="side-boxes-login">
              <button type="submit" className="button-primary">Login</button>
              <button type="button" className="button-primary" onClick={toggleLogin}>Chiudi</button>
            </div>

          </form>
        </div>
      )}


      {/* SIGNUP MODAL */}
      {isVisibleSignup && (
        <div id="signup-box" className="login-box">
          <h2>Registrazione</h2>
          <form onSubmit={(e) => { e.preventDefault(); if (validateSignup()) signup(); }}>

            <div className="user-box">
              <input
                type="text"
                value={nomeSignup}
                onChange={(e) => setNomeSignup(e.target.value)}
                placeholder=" "
              />
              <label>Nome</label>
              {errorsSignUp.nomeSignup && (
                <div className="msg-error">{errorsSignUp.nomeSignup}</div>
              )}
            </div>

            <div className="user-box">
              <input
                type="text"
                value={cognomeSignup}
                onChange={(e) => setCognomeSignup(e.target.value)}
                placeholder=" "
              />
              <label>Cognome</label>
              {errorsSignUp.cognomeSignup && (
                <div className="msg-error">{errorsSignUp.cognomeSignup}</div>
              )}
            </div>

            <div className="user-box">
              <input
                type="date"
                value={dataNascitaSignup}
                onChange={(e) => setDataNascitaSignup(e.target.value)}
                placeholder=" "
              />
              <label>Data di Nascita</label>
              {errorsSignUp.dataNascitaSignup && (
                <div className="msg-error">{errorsSignUp.dataNascitaSignup}</div>
              )}
            </div>

            <div className="user-box">
              <select value={genereSignup} onChange={(e) => setGenereSignup(e.target.value)} >
                <option value="" disabled>Seleziona genere</option>
                <option value="M">Maschio</option>
                <option value="F">Femmina</option>
                <option value="A">Altro</option>
              </select>
              <label>Genere</label>
              {errorsSignUp.genereSignup && (
                <div className="msg-error">{errorsSignUp.genereSignup}</div>
              )}
            </div>

            <div className="user-box">
              <input
                type="text"
                value={indirizzoDomicilioSignup}
                onChange={(e) => setIndirizzoDomicilioSignup(e.target.value)}
                placeholder=" "
              />
              <label>Indirizzo di Domicilio</label>
              {errorsSignUp.indirizzoDomicilioSignup && (
                <div className="msg-error">{errorsSignUp.indirizzoDomicilioSignup}</div>
              )}
            </div>

            <div className="user-box">
              <input
                type="tel"
                value={numeroTelefonoSignup}
                onChange={(e) => setNumeroTelefonoSignup(e.target.value)}
                placeholder=" "
              />
              <label>Numero di Telefono</label>
              {errorsSignUp.numeroTelefonoSignup && (
                <div className="msg-error">{errorsSignUp.numeroTelefonoSignup}</div>
              )}
            </div>

            <div className="user-box">
              <input
                type="email"
                value={emailSignup}
                onChange={(e) => setEmailSignup(e.target.value)}
                placeholder=" "
              />
              <label>Email</label>
              {errorsSignUp.emailSignup && (
                <div className="msg-error">{errorsSignUp.emailSignup}</div>
              )}
            </div>

            <div className="user-box">
              <input
                type="password"
                value={passwordSignup}
                onChange={(e) => setPasswordSignup(e.target.value)}
                placeholder=" "
              />
              <label>Password</label>
              {errorsSignUp.passwordSignup && (
                <div className="msg-error">{errorsSignUp.passwordSignup}</div>
              )}
            </div>

            <div className="user-box">
              <input
                type="password"
                value={confermaPasswordSignup}
                onChange={(e) => setConfermaPasswordSignup(e.target.value)}
                placeholder=" "
              />
              <label>Conferma Password</label>
              {errorsSignUp.confermaPasswordSignup && (
                <div className="msg-error">{errorsSignUp.confermaPasswordSignup}</div>
              )}
            </div>

            <div className="side-boxes-login">
              <button type="submit" className="button-primary">Registrati</button>
              <button type="button" className="button-primary" onClick={toggleSignUp}>Chiudi</button>
            </div>

          </form>
        </div>
      )}
    </>
  );
}

export default Navbar;
