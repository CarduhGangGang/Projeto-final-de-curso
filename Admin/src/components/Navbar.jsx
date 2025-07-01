import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase-client';

const Navbar = ({ previewMode = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [logoInput, setLogoInput] = useState('');
  const [notification, setNotification] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogo = async () => {
      const { data, error } = await supabase
        .from('navbar_config')
        .select('logo_url')
        .eq('id', 1)
        .single();

      if (!error && data?.logo_url) {
        setLogoUrl(data.logo_url);
        setLogoInput(data.logo_url);
      }

      setLoading(false);
    };

    fetchLogo();
  }, []);

  useEffect(() => {
    if (!previewMode) {
      const handleScroll = () => setIsScrolled(window.scrollY > 10);
      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [previewMode]);

  const handleSaveUrl = async () => {
    if (!logoInput) return;

    const { error } = await supabase
      .from('navbar_config')
      .update({ logo_url: logoInput })
      .eq('id', 1);

    if (error) {
      setNotification({ type: 'error', message: 'Erro ao atualizar o logo.' });
    } else {
      setNotification({ type: 'success', message: 'Logo atualizado com sucesso!' });
      setLogoUrl(logoInput);
    }

    setTimeout(() => setNotification(null), 4000);
  };

  if (loading) {
    return (
      <div className="p-4 text-gray-500 text-sm">
        A carregar conteúdo...
      </div>
    );
  }

  return (
    <>
      <nav
        className={`w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 
        ${previewMode ? 'relative bg-white py-6' :
          `${isScrolled ? "fixed top-0 left-0 bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "fixed top-0 left-0 py-4 md:py-6"}`
        }`}
      >
        {/* LOGO */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => !previewMode && (window.location.href = '/')}
        >
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Logo"
              className="h-8 sm:h-10 object-contain"
            />
          )}
        </div>

        {/* LINKS (simulados no preview também) */}
        <ul className="hidden md:flex items-center gap-6 text-sm font-medium">
          <li><a href="#" className="hover:underline">Home</a></li>
          <li><a href="#" className="hover:underline">Sobre</a></li>
          <li><a href="#" className="hover:underline">Contacto</a></li>
          <li><a href="#" className="hover:underline">Serviços</a></li>
        </ul>
      </nav>

      {/* PREVIEW CONTROLS */}
      {previewMode && (
        <div className="px-4 mt-6 flex flex-col items-start gap-3 max-w-lg">
          <input
            type="text"
            value={logoInput}
            onChange={(e) => setLogoInput(e.target.value)}
            placeholder="Insere o URL da imagem do logo"
            className="border px-3 py-2 rounded w-full text-sm"
          />

          {logoInput && (
            <img
              src={logoInput}
              alt="Preview"
              className="h-16 mt-2 border rounded object-contain"
            />
          )}

          <button
            onClick={handleSaveUrl}
            className="bg-blue-600 hover:bg-blue-700 text-black px-4 py-2 rounded text-sm mt-2"
          >
            Guardar URL
          </button>

          {notification && (
            <div className={`mt-2 text-sm px-3 py-2 rounded ${notification.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {notification.message}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Navbar;
