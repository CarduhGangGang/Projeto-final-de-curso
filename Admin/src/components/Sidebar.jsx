import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Bell,
  LayoutDashboard,
  BarChart2,
  LogOut,
  Euro,
  Mail,
  Map,
  FileText
} from "lucide-react";
import { UserAuth } from "../context/Authcontext";
import casaIcon from "../assets/casa.png";

const Sidebar = () => {
  const { user, signOut } = UserAuth();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  if (!user) return null;

  const navLinks = [
    { to: "/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { to: "/orcamentos", icon: <Euro size={20} />, label: "Orçamentos" },
    { to: "/newsletter", icon: <Mail size={20} />, label: "Newsletter" },
    { to: "/modal", icon: <Map size={20} />, label: "Modal" },
    { to: "/pages", icon: <FileText size={20} />, label: "Pages" },
    { to: "/profile", icon: <BarChart2 size={20} />, label: "Profile" },
    { to: "/notificacoes", icon: <Bell size={20} />, label: "Notificações" },
  ];

  const handleLogout = () => {
    signOut();
    window.location.href = "http://localhost:3000";
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen bg-white shadow-xl z-50 transition-all duration-300 flex flex-col justify-between ${
        isMobile ? "w-20" : "w-64"
      }`}
    >
      <div className="flex-1 p-4 overflow-y-auto">
        <div
          className={`flex items-center mb-8 ${
            isMobile ? "justify-center" : "justify-start gap-2"
          }`}
        >
          <img src={casaIcon} alt="Casa" className="h-6 w-6" />
          {!isMobile && (
            <h2 className="text-sm font-semibold text-black truncate">
              {user?.email ? `Olá, ${user.email}` : "Bem-vindo!"}
            </h2>
          )}
        </div>
        <nav className="space-y-2">
          {navLinks.map(({ to, icon, label }, i) => (
            <NavLink
              key={i}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-md text-black text-sm transition duration-200 ${
                  isActive ? "bg-gray-200 font-medium" : "hover:bg-gray-100"
                }`
              }
              title={isMobile ? label : ""}
            >
              {icon}
              {!isMobile && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 text-red-600 hover:text-red-800 w-full ${
            isMobile ? "justify-center" : ""
          }`}
          title="Sair"
        >
          <LogOut size={20} />
          {!isMobile && <span>Sair</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
