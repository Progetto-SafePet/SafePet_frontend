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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const [usernameLogin, setUsernameLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');

  const location = useLocation();
  const { usernameGlobal, updateUsername } = useUser();
  const navigate = useNavigate();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const toggleDropdown = (menu: string) => {
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

  const login = () => {
    const user = { username: usernameLogin, password: passwordLogin };
    fetch(`${ENV.ENVIRONMENT}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
      .then(res => {
        if (res.ok) {
          return res.json().then(data => {
            localStorage.setItem('authToken', data.username);
            localStorage.setItem('userRole', data.role);
            localStorage.setItem('userId', data.userId);
            updateUsername(data.username);
          });
        }
      })
      .catch(() => {});
    toggleLogin();
  };

  const logOut = () => {
    updateUsername('');
    localStorage.clear();
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
                <Link className="button-primary" to="/profile">{usernameGlobal}</Link>
                <button className="button-primary" onClick={logOut}>Logout</button>
              </>
            )}
          </nav>
        </div>
      </header>

      {isVisibleLogin && (
        <div id="login-box" className="login-box">
          <h2>Login</h2>
          <form>
            <div className="user-box">
              <input id="username" type="text" value={usernameLogin} onChange={(e) => setUsernameLogin(e.target.value)} required />
              <label>Username</label>
            </div>
            <div className="user-box">
              <input id="password" type="password" value={passwordLogin} onChange={(e) => setPasswordLogin(e.target.value)} required />
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
