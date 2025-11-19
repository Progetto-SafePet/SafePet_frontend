import React, { useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.scss';
import Navbar from './components/Navbar/Navbar';
import Home from './Pages/Home';
import Footer from './components/Footer/Footer';
import { UserProvider } from './Contexts/UserProvider'; 
import Pet from './Pages/Pet';
import RegisterPet from './Pages/RegisterPet2';
import ProtectedRoute from './ProtectedRoute';

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
              <ProtectedRoute allowedRoles={["PROPRIETARIO", "ADMIN"]}>
                <Pet />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/petAdmin" 
            element={
              <ProtectedRoute allowedRoles={["PROPRIETARIO", "ADMIN"]}>
                <Pet />
              </ProtectedRoute>
            }
          />

          <Route 
            path="/registerPet" 
            element={
              <ProtectedRoute allowedRoles={["PROPRIETARIO"]}>
                <RegisterPet />
              </ProtectedRoute>
            }
          />

          <Route path="/unauthorized" element={<div>Accesso non autorizzato</div>} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </UserProvider>
  );

}

export default App;
