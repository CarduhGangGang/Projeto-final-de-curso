import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scrolla automaticamente para o topo sempre que a rota mudar
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);

  return null; // Este componente não renderiza nada
};

export default ScrollToTop;
