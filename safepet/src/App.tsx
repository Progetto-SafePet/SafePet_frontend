import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.scss';
import Navbar from './components/Navbar/Navbar';
import Home from './Pages/Home';
import Footer from './components/Footer/Footer';
import { UserProvider } from './Contexts/UserProvider'; 
import Pet from './Pages/Pet';
import RegisterPet from './Pages/RegisterPet';
import ElencoVet from './Pages/ElencoVet';
import ListaPazienti from "./Pages/ListaPazienti";
import ProtectedRoute from './ProtectedRoute';
import { CONSTANTS } from './constants';
import Unauthorized from "./Pages/Unauthorized";
import Page404 from "./Pages/Page404";
import TestRecensione from './Pages/TestRecensione';
import TestNota from './Pages/TestNota';

function App() {

  return (
    <UserProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route 
            path="/pet" 
            element={
              <ProtectedRoute allowedRoles={[CONSTANTS.ROLE.PROPRIETARIO]}>
                <Pet/>
              </ProtectedRoute>
            }
          />


          <Route
            path="/pazienti"
            element={
                <ProtectedRoute allowedRoles={[CONSTANTS.ROLE.VETERINARIO]}>
                  <ListaPazienti />
                </ProtectedRoute>
              }
            />

            {/* NUOVA ROTTA: TEST RECENSIONE (NON PROTETTA PER IL TEST)*/}
            <Route
                path="/TestRecensione"
                element={
                        <TestRecensione/>
                }
            />

          <Route path="/TestNota" element={<TestNota/>} />

          <Route
            path="/registerpet" 
            element={
              <ProtectedRoute allowedRoles={[CONSTANTS.ROLE.PROPRIETARIO]}>
                <RegisterPet />
              </ProtectedRoute>
            }
          />
          <Route path="/ElencoVet" element={<ElencoVet />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </UserProvider>
  );

}

export default App;
