import * as React from 'react';
import { useContext, useEffect, useState } from 'react'
import './Navbar.scss'
import { Link, useLocation, useNavigate} from 'react-router-dom'
import axios from 'axios';
import { ENV } from '../../env';
import { useUser } from '../../Contexts/UserProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Navbar() {

  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleLogin, setIsVisibleLogin] = useState(false);
  const [isVisibleSignup, setIsVisibleSignup] = useState(false);

  const location = useLocation();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('M');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [paths, setPaths] = useState([{ path: "", label: "" }]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [usernameLogin, setUsernameLogin] = useState('');
  const [passwordLogin, setPasswordLogin] = useState('');
  const [feedback, setFeedback] = useState({ message: '', type: '' });
  const [showFeedback, setShowFeedback] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState('');

  const { usernameGlobal, updateUsername } = useUser();

  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  const toggleLogin = () => {
    if(isVisibleSignup)
      setIsVisibleSignup(!isVisibleSignup);
    setIsVisibleLogin(!isVisibleLogin);

    console.log("click")
  };

  const toggleSignUp = () => {
    if(isVisibleLogin)
      setIsVisibleSignup(!isVisibleLogin);
    setIsVisibleSignup(!isVisibleSignup);
    console.log("click")
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
          } else {
            let msg;
            if (res.status === 401) {
              msg = 'Username o password errati';
            } else {
              msg = 'Login fallito, riprova';
            }
          }
        })
        .catch(() => {
        });

    toggleLogin();
  };

  const logOut = () => {
    updateUsername('');
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    navigate('/');
  };

  const askLogout = () => {
    const msg = 'Sei sicuro di voler effettuare il logout?';
    setConfirmMessage(msg);
    setIsConfirmOpen(true);
  };

  const handleConfirm = () => {
    setIsConfirmOpen(false);
    logOut();
  };

  const handleCancel = () => {
    setIsConfirmOpen(false);
  };


  const signup = () => {
    const user = { name, surname, birthDate, gender, username, email, password };

    fetch(`${ENV.ENVIRONMENT}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
        .then(res => {
          if (res.ok) {
          } else {
            let msg;
            if (res.status === 409) {
              msg = 'Username o Email già registrati!';
            } else {
              msg = 'Registrazione Fallita!';
            }
          }
        })
        .catch(() => {
        });
    toggleSignUp()
  };

  return (
    <>
      <header>
        <div className="navbar light-neutral-10">
          <div>
            <Link to="/">
              <img className = "logo-img" src="../imgs/logo.webp" alt="Logo"></img>
            </Link>
          </div>
          <nav className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
            {paths.map((path, index) => (
              <Link key={index} to={path.path} className={path.path === location.pathname ? 'active fw-600' : 'fw-500'} onClick={() => setIsMenuOpen(false)}>
                {path.label}
              </Link>
            ))}
            {!usernameGlobal && (<a id = "log-in-button" className="button-primary" onClick={toggleLogin} data-discover="true">Login</a>)}
            {!usernameGlobal && (<a className="button-primary" onClick={toggleSignUp} data-discover="true">Registrati</a>)}
            {usernameGlobal && (<Link className="button-primary" to={"/profile"}  data-discover="true">{usernameGlobal}</Link>)}
            {usernameGlobal && (<a className="button-primary" onClick={askLogout} data-discover="true">Log out</a>)}
          </nav>
        </div>
      </header>
      {isVisibleLogin && (
        <div id="login-box" className="login-box">
          <h2>Login</h2>
          <form>
            <div className="user-box">
            <input
                  id="username"
                  type="text"
                  value={usernameLogin}
                  onChange={(e) => setUsernameLogin(e.target.value)}
                  required
                />
                <label>Username</label>
              </div>
            <div className="user-box">
            <input
                  id="password"
                  type="password"
                  value={passwordLogin}
                  onChange={(e) => setPasswordLogin(e.target.value)}
                  required
                />
                <label>Password</label>
            </div>
            <div className='side-boxes-login'>
              <a className="button-primary" onClick={login} data-discover="true">Login</a>
              <a className="button-primary" onClick={toggleLogin} data-discover="true">Chiudi</a>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

export default Navbar;
