import React from 'react';
import { Link, useLocation } from "react-router-dom";
import { assets } from "../assets/assets";
import { generateAdminToken } from '../utils/token';

const Navbar = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Sobre', path: '/sobre' },
    { name: 'Contacto', path: '/contacto' },
    { name: 'Serviços', path: '/servicos' },
  ];

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  // ✅ Clique inteligente no logo
  const handleLogoClick = async (e) => {
    e.preventDefault();

    if (e.shiftKey || e.ctrlKey || e.altKey) {
      try {
        const token = await generateAdminToken();
        // Redireciona para o painel admin (localhost:5173)
        window.location.href = `http://localhost:5173/signin?token=${token}`;
      } catch (err) {
        console.error("Erro ao gerar token de admin:", err);
      }
    } else {
      // Clique normal vai para a home local
      window.location.href = '/';
    }
  };

  return (
    <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${isScrolled ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"}`}>
      
      {/* Logo com clique inteligente */}
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={handleLogoClick}
        title="Clique com Ctrl/Shift/Alt para entrar como admin"
      >
        <img src={assets.logo} alt="logo" className="h-9" />
      </div>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-6 lg:gap-10 ml-auto">
        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            className="group flex flex-col gap-0.5 text-black"
          >
            {link.name}
            <div className="bg-black h-0.5 w-0 group-hover:w-full transition-all duration-300" />
          </Link>
        ))}
      </div>

      {/* Mobile Toggle */}
      <div className="flex items-center gap-3 md:hidden">
        <img
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          src={assets.menuIcon}
          alt="menu"
          className="h-5 brightness-0 cursor-pointer"
          aria-label="Abrir menu"
        />
      </div>

      {/* Mobile Menu */}
      <div className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <button className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)} aria-label="Fechar menu">
          <img src={assets.closeIcon} alt="close-menu" className='h-6.5' />
        </button>

        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            onClick={() => setIsMenuOpen(false)}
            className="text-black"
          >
            {link.name}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default Navbar;
