import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabase-client';

const Navbar = ({ previewMode = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [logoInput, setLogoInput] = useState('');
  const [notification, setNotification] = useState(null);

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
      setNotification({ type: 'error', message: 'Erro ao atualizar o logo no banco.' });
    } else {
      setNotification({ type: 'success', message: 'Logo atualizado com sucesso!' });
      setLogoUrl(logoInput);
    }

    setTimeout(() => setNotification(null), 4000);
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${isScrolled ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"}`}>
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => window.location.href = '/'}
          title="Ir para a página inicial"
        >
          {/* Logo removido aqui */}
        </div>
      </nav>

      {previewMode && (
        <div className="px-4 mt-4 flex flex-col items-start gap-3 max-w-lg">
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
