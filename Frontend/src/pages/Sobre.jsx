import React, { useEffect, useState } from "react";
import Hero from "../components/Sobre/Hero";
import NossaVisao from "../components/Sobre/NossaVisao"; 
import Oquefazemos from "../components/Sobre/Oquefazemos";
import Connects from "../components/Sobre/Connects";
import Footer from "../components/Footer";
import Nossahistoria from "../components/Sobre/Nossahistoria";

// Caminho do logo (ajusta conforme necessário)
import logo from "../assets/logo.svg"; // ou .png, .webp, conforme o teu projeto

const Sobre = () => {
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
          <Nossahistoria />
          <NossaVisao /> 
          <Oquefazemos />
          <Connects />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Sobre;
