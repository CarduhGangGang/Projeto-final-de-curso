import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Footer = () => {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleNavigationClick = (e, targetPath) => {
    e.preventDefault();

    setOverlayVisible(true);

    setTimeout(() => {
      setOverlayVisible(false);

      // Só navega se ainda não estiver nessa rota
      if (pathname !== targetPath) {
        navigate(targetPath);
      }

      // Faz scroll para o topo em todos os casos
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  return (
    <>
      {overlayVisible && (
        <div className="fixed inset-0 bg-black/40 opacity-100 z-[9999] pointer-events-none transition-opacity duration-300" />
      )}

      <footer className="bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 pt-10 w-full text-gray-500 dark:text-gray-400">
        <div className="flex flex-col md:flex-row justify-between gap-10 border-b border-gray-500/30 dark:border-gray-700 pb-6">
          {/* Coluna 1 - Logo e texto */}
          <div className="md:max-w-96 flex flex-col items-start text-center md:text-left">
            <Link
              to="/"
              onClick={(e) => handleNavigationClick(e, '/')}
              className="mb-4 self-center md:self-start"
            >
              <img src="/logo.png" alt="Kentacentro Logo" className="h-8" />
            </Link>
            <p className="text-sm">
              Somos especialistas na representação, promoção, venda e instalação de soluções
              inteligentes de conforto ambiental. Atuamos com foco na eficiência energética,
              sustentabilidade e redução de custos.
            </p>
          </div>

          {/* Colunas 2 e 3 - Links e Contactos */}
          <div className="flex flex-col sm:flex-row flex-wrap md:flex-nowrap gap-10 md:gap-20 items-center md:items-start justify-between w-full md:w-auto text-center md:text-left">
            <div>
              <h2 className="font-semibold mb-4 text-gray-800 dark:text-gray-200">Company</h2>
              <ul className="text-sm space-y-2">
                <li>
                  <Link to="/" onClick={(e) => handleNavigationClick(e, '/')}>Home</Link>
                </li>
                <li>
                  <Link to="/sobre" onClick={(e) => handleNavigationClick(e, '/sobre')}>Sobre</Link>
                </li>
                <li>
                  <Link to="/contacto" onClick={(e) => handleNavigationClick(e, '/contacto')}>Contacto</Link>
                </li>
                <li>
                  <Link to="/serviços" onClick={(e) => handleNavigationClick(e, '/servicos')}>Serviços</Link>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="font-semibold mb-4 text-gray-800 dark:text-gray-200">Contactos</h2>
              <div className="text-sm space-y-2">
                <p>+351 917 573 574</p>
                <p>kentacentro@kentacentro.com</p>
              </div>
            </div>
          </div>
        </div>

        <p className="pt-6 text-center text-xs md:text-sm pb-6">
          © 2024 Kentacentro. All rights reserved.
        </p>
      </footer>
    </>
  );
};

export default Footer;
