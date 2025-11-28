import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.scss';
import Navbar from './components/Navbar/Navbar';
import Home from './Pages/Home';
import Footer from './components/Footer/Footer';
import { UserProvider } from './Contexts/UserProvider';
import Pet from './Pages/Pet';
import RegisterPet from './Pages/RegisterPet';
import ElencoVet from './Pages/ElencoVet';
import DettagliVeterinario from './Pages/DettagliVeterinario';
import ListaPazienti from "./Pages/ListaPazienti";
import InsertLinkingCode from "./Pages/InsertLinkingCode";
import ProtectedRoute from './ProtectedRoute';
import { CONSTANTS } from './constants';
import Unauthorized from "./Pages/Unauthorized";
import Page404 from "./Pages/Page404";
import TestVisitaMedica from "./Pages/TestVisitaMedica";
import TestPatologia from "./Pages/TestPatologia";
import TestVaccinazione from "./Pages/TestVaccinazione";
import TestRecensione from './Pages/TestRecensione';
import TestNota from './Pages/TestNota';
import DettagliPet from './Pages/DettagliPet';
import TestTerapia from './Pages/TestTerapia';

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
            path="/TestRecensione"
            element={
              <TestRecensione />
            }
          />

          <Route path="/TestNota" element={<TestNota />} />

          <Route path="/TestVisitaMedica" element={<TestVisitaMedica />} />

          <Route
            path="/TestVaccinazione"
            element={
              // <ProtectedRoute allowedRoles={[CONSTANTS.ROLE.VETERINARIO]}>
              <TestVaccinazione />
              //</ProtectedRoute>
            }
          />
          <Route path="/TestPatologia" element={<TestPatologia />} />
          <Route path="/test-terapia" element={<TestTerapia />} />

          <Route path="/ElencoVet" element={<ElencoVet />} />
            <Route path="/veterinario/:id" element={<DettagliVeterinario />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </UserProvider>
  );

}

export default App;
