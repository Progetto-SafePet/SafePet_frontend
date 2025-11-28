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
import Patologia from "./components/formRecordMedico/formPatologia";
import Terapia from "./components/formRecordMedico/formTerapia";
import Vaccinazione from "./components/formRecordMedico/FormVaccinazione";
import VisitaMedica from "./components/formRecordMedico/FormVisitaMedica";

import DettagliPaziente from "./Pages/DettagliPaziente";
import TestRecensione from './Pages/TestRecensione';
import TestNota from './Pages/TestNota';
import DettagliPet from './Pages/DettagliPet';
import TestTerapia from './Pages/TestTerapia';
import TestVisitaMedica from './Pages/TestVisitaMedica';
import TestVaccinazione from './Pages/TestVaccinazione';
import TestPatologia from './Pages/TestPatologia';
import FAQ from './Pages/FAQ';
import Contatti from './Pages/Contatti';

function App() {

  return (
    <UserProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/faq" element={<FAQ />} />

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
            path="/TestRecensione"
            element={
              <TestRecensione />
            }
          />

          <Route path="/TestNota" element={<TestNota />} />

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
                path="/DettagliPaziente/:id"
                element={
                    <ProtectedRoute allowedRoles={[CONSTANTS.ROLE.VETERINARIO]}>
                        <DettagliPaziente />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/patologia/:id"
                element={
                    <ProtectedRoute allowedRoles={[CONSTANTS.ROLE.VETERINARIO]}>
                        <Patologia />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/visitaMedica/:id"
                element={
                    <ProtectedRoute allowedRoles={[CONSTANTS.ROLE.VETERINARIO]}>
                        <VisitaMedica />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/vaccinazione/:id"
                element={
                    <ProtectedRoute allowedRoles={[CONSTANTS.ROLE.VETERINARIO]}>
                        <Vaccinazione />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/terapia/:id"
                element={
                    <ProtectedRoute allowedRoles={[CONSTANTS.ROLE.VETERINARIO]}>
                        <Terapia />
                    </ProtectedRoute>
                }
            />
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
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </UserProvider>
  );

}

export default App;
