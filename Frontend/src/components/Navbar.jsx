import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../supabase-client';
import { generateAdminToken } from '../utils/token'; // <-- assegura que este utilitário existe

const Navbar = ({ previewMode = false }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Sobre', path: '/sobre' },
    { name: 'Contacto', path: '/contacto' },
    { name: 'Serviços', path: '/servicos' },
  ];

  useEffect(() => {
    const fetchLogo = async () => {
      const { data } = await supabase
        .from('navbar_config')
        .select('logo_url')
        .eq('id', 1)
        .single();
      if (data?.logo_url) {
        setLogoUrl(data.logo_url);
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

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogoClick = async (e) => {
    e.preventDefault();
    if (e.ctrlKey || e.shiftKey || e.altKey) {
      try {
        const token = await generateAdminToken();
        window.location.href = `https://projeto-final-de-curso-kjbl.vercel.app/signin?token=${token}`;
      } catch (err) {
        console.error("Erro ao gerar token de admin:", err);
      }
    } else {
      window.location.href = '/';
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur shadow-md py-3' : 'py-5'}`}>
        {/* Logo */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={handleLogoClick}
          title="Clique com Ctrl, Shift ou Alt para entrar como admin"
        >
          {logoUrl && <img src={logoUrl} alt="logo" className="h-9 w-auto select-none" />}
        </div>

        {/* Links Desktop */}
        <div className="hidden md:flex gap-6 text-black font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="hover:underline underline-offset-4"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Hamburger Button */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className="md:hidden text-black"
          aria-label="Abrir menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
            viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {/* Menu Mobile */}
      {isMenuOpen && (
        <div className="fixed top-0 left-0 w-full h-screen bg-white flex flex-col items-center justify-center gap-8 text-xl text-black z-40">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className="hover:underline underline-offset-4"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </>
  );
};

export default Navbar;
