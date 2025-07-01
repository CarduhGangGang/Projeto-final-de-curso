import React, { useEffect, useState } from 'react';
import Hero from '../components/Serviços/Hero';
import Services from '../components/Serviços/Services';
import Footer from '../components/Serviços/Footer';

// Importa o logo do teu projeto
import logo from '../assets/logo.svg'; // ajusta o caminho conforme necessário

const Serviços = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 bg-white bg-opacity-80 flex flex-col items-center justify-center">
          <img src={logo} alt="Logo" className="w-20 h-20 mb-4 animate-pulse" />
          <div className="w-6 h-6 border-4 border-gray-300 border-t-black rounded-full animate-spin"></div>
        </div>
      )}

      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Hero />
          <Services />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Serviços;
