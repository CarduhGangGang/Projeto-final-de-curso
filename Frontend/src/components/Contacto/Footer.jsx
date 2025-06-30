import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../../../supabase-client';

const Footer = () => {
  const [overlayVisible, setOverlayVisible] = useState(false);
  const [footerData, setFooterData] = useState(null);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    const fetchFooterData = async () => {
      const { data, error } = await supabase
        .from('footer_info')
        .select('*')
        .eq('is_final', true)
        .single();

      if (!error && data) {
        setFooterData(data);
      }
    };

    fetchFooterData();
  }, []);

  const handleNavigationClick = (e, targetPath) => {
    e.preventDefault();
    setOverlayVisible(true);

    setTimeout(() => {
      setOverlayVisible(false);
      if (pathname !== targetPath) {
        navigate(targetPath);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 600);
  };

  if (!footerData) return null; // Não mostra nada enquanto os dados não estão carregados

  return (
    <>
      {overlayVisible && (
        <div className="fixed inset-0 bg-black/40 opacity-100 z-[9999] pointer-events-none transition-opacity duration-300" />
      )}

      <footer className="bg-gray-100 dark:bg-gray-900 px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 pt-10 w-full text-gray-500 dark:text-gray-400">
        <div className="flex flex-col md:flex-row justify-between gap-10 border-b border-gray-500/30 dark:border-gray-700 pb-6">
          {/* Coluna 1 - Logo e descrição */}
          <div className="md:max-w-96 flex flex-col items-start text-center md:text-left">
            <Link
              to="/"
              onClick={(e) => handleNavigationClick(e, '/')}
              className="mb-4 self-center md:self-start"
            >
              <img src={footerData.logo_url} alt="Logo" className="h-8" />
            </Link>
            <p className="text-sm">{footerData.descricao}</p>
          </div>

          {/* Coluna 2 - Links */}
          <div className="flex flex-col sm:flex-row flex-wrap md:flex-nowrap gap-10 md:gap-20 items-center md:items-start justify-between w-full md:w-auto text-center md:text-left">
            {footerData.titulo_coluna1 && (
              <div>
                <h2 className="font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  {footerData.titulo_coluna1}
                </h2>
                <ul className="text-sm space-y-2">
                  {footerData.links_coluna1?.map((link, idx) => (
                    <li key={idx}>
                      <Link to={link.url} onClick={(e) => handleNavigationClick(e, link.url)}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Coluna 3 - Contactos */}
            {footerData.titulo_coluna2 && (
              <div>
                <h2 className="font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  {footerData.titulo_coluna2}
                </h2>
                <div className="text-sm space-y-2">
                  <p>{footerData.contacto_telefone}</p>
                  <p>{footerData.contacto_email}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <p className="pt-6 text-center text-xs md:text-sm pb-6">
          {footerData.copyright}
        </p>
      </footer>
    </>
  );
};

export default Footer;
