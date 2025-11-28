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
import InsertLinkingCode from "./Pages/InsertLinkingCode";
import ProtectedRoute from './ProtectedRoute';
import { CONSTANTS } from './constants';
import Unauthorized from "./Pages/Unauthorized";
import Page404 from "./Pages/Page404";
import ProfiloProprietario from './Pages/ProfiloProprietario';
import DettagliPaziente from "./Pages/DettagliPaziente";
import DettagliPet from './Pages/DettagliPet';
import FAQ from './Pages/FAQ';
import Contatti from './Pages/Contatti';

function App() {

  return (
    <UserProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/faq"
            element={<FAQ />}
          />

          <Route path="/contact" element={<Contatti />} />

          <Route
            path="/pet"
            element={
              <ProtectedRoute allowedRoles={[CONSTANTS.ROLE.PROPRIETARIO]}>
                <Pet />
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


          <Route
            path="/dettaglioPet/:id"
            element={
              <ProtectedRoute allowedRoles={[CONSTANTS.ROLE.PROPRIETARIO]}>
                <DettagliPet />
              </ProtectedRoute>
            }
          />

          <Route
            path="/registerpet"
            element={
              <ProtectedRoute allowedRoles={[CONSTANTS.ROLE.PROPRIETARIO]}>
                <RegisterPet />
              </ProtectedRoute>
            }
          />

          <Route
            path="/aggiuntaPaziente"
            element={
              <ProtectedRoute allowedRoles={[CONSTANTS.ROLE.VETERINARIO]}>
                <InsertLinkingCode />
              </ProtectedRoute>
            }
          />

          <Route
            path="/registerpet"
            element={
              <ProtectedRoute allowedRoles={[CONSTANTS.ROLE.PROPRIETARIO]}>
                <RegisterPet />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profilo-proprietario"
            element={
              <ProtectedRoute allowedRoles={[CONSTANTS.ROLE.PROPRIETARIO]}>
                <ProfiloProprietario />
              </ProtectedRoute>
            }
          />

          <Route
            path="/DettagliPaziente/:id"
            element={
              <ProtectedRoute allowedRoles={[CONSTANTS.ROLE.VETERINARIO]}>
                <DettagliPaziente />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ElencoVet"
            element={<ElencoVet />}
          />

          <Route
            path="/unauthorized"
            element={<Unauthorized />}
          />

          <Route
            path="*"
            element={<Page404 />}
          />

        </Routes>
        <Footer />
      </BrowserRouter>
    </UserProvider>
  );

}

export default App;
