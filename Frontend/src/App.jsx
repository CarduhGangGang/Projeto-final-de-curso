import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SobrePage from './pages/Sobre';
import Contacto from './pages/Contacto';
import Serviços from './pages/Serviços';
import ScrollToTop from './components/ScrollToTop';
import RequestOrc from './components/RequestOrc';

const App = () => {
  const { pathname } = useLocation();
  const hideNavbarOnOwner = pathname.toLowerCase().startsWith('/owner');

  const [showRequestOrc, setShowRequestOrc] = useState(false);

  const openModal = () => setShowRequestOrc(true);
  const closeModal = () => setShowRequestOrc(false);

  return (
    <div>
      {!hideNavbarOnOwner && <Navbar onRequestClick={openModal} />}
      {showRequestOrc && <RequestOrc onClose={closeModal} />}
      <ScrollToTop />

      <main className="min-h-[70vh]">
        <Routes>
          <Route path="/" element={<Home onRequestClick={openModal} />} />
          <Route path="/sobre" element={<SobrePage />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/servicos" element={<Serviços />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
