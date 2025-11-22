import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.scss';
import Navbar from './components/Navbar/Navbar';
import Home from './Pages/Home';
import Footer from './components/Footer/Footer';
import { UserProvider } from './Contexts/UserProvider'; 
import Pet from './Pages/Pet';
import RegisterPet from './Pages/RegisterPet';
import ElencoVet from './components/ElencoVet/ElencoVet';
import ProtectedRoute from './ProtectedRoute';
import { CONSTANTS } from './constants';

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
            path="/registerpet" 
            element={
              <ProtectedRoute allowedRoles={[CONSTANTS.ROLE.PROPRIETARIO]}>
                <RegisterPet />
              </ProtectedRoute>
            }
          />
            <Route path="/ElencoVet" element={<ElencoVet />} />
          <Route path="/unauthorized" element={<div>Accesso non autorizzato</div>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </UserProvider>
  );

}

export default App;
