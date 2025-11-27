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
import Patologia from "./components/formRecordMedico/formPatologia";
import Terapia from "./components/formRecordMedico/formTerapia";
import Vaccinazione from "./components/formRecordMedico/FormVaccinazione";
import VisitaMedica from "./components/formRecordMedico/FormVisitaMedica";

import DettagliPaziente from "./Pages/DettagliPaziente";

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
