import { useEffect, useState } from "react";

import Hero from '../components/Hero';
import Brands from '../components/Brands';
import Separador from '../components/Separador';
import Solucoes from '../components/Solucoes';
import AboutUs from '../components/AboutUs';
import Testimonial from '../components/Testimonial';
import NewsLetter from '../components/NewsLetter';
import Footer from '../components/Footer';
import RequestOrc from '../components/RequestOrc';

// Caminho do logo (ajusta conforme necessário)
import logo from '../assets/logo.svg'; // ou logo.png

function isAdmin() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return false;
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload?.role === "admin";
  } catch {
    return false;
  }
}

const Home = () => {
  const [showOrcamento, setShowOrcamento] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simula carregamento
    const timeout = setTimeout(() => setLoading(false), 1200); // ou ajusta conforme
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

      {isAdmin() && (
        <div style={{ margin: 20 }}>
          <a href="http://localhost:5173/auth" target="_self">
            <button style={{ padding: "10px 20px", background: "#1d4ed8", color: "#fff", borderRadius: "6px" }}>
              🔐 Acesso Administrativo
            </button>
          </a>
        </div>
      )}

      <div className="flex flex-col min-h-screen">
        <main className="flex-grow">
          <Hero onOrcamentoClick={() => setShowOrcamento(true)} />
          <AboutUs />
          <Brands />
          <Separador />
          <Solucoes />
          <Testimonial />
          <NewsLetter />
        </main>
        <Footer />

        {showOrcamento && (
          <RequestOrc onClose={() => setShowOrcamento(false)} />
        )}
      </div>
    </>
  );
};

export default Home;
