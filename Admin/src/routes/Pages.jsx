import React, { useState } from "react";
import Navbar from "../components/Navbar";
import HeroHome from "../webPages/Home/HeroHome";
import HeroSobre from "../webPages/Sobre/HeroSobre";
import AboutUs from "../webPages/Home/AboutUs";
import Brands from "../webPages/Home/Brands";
import Separador from "../webPages/Home/Separador";
import Solucoes from "../webPages/Home/Solucoes";
import Testimonial from "../webPages/Home/Testimonial";
import Newsletter from "../webPages/Home/Newsletter";
import Footer from "../components/Footer";
import Nossahistoria from "../webPages/Sobre/Nossahistoria";
import NossaVisao from "../webPages/Sobre/NossaVisao";
import Oquefazemos from "../webPages/Sobre/Oquefazemos";
import Connects from "../webPages/Sobre/Connects";
import HeroContacto from "../webPages/Contacto/HeroContacto";
import HeroServiços from "../webPages/Serviços/HeroServiços";
import Contacto from "../webPages/Contacto/Contacto";
import Services from "../webPages/Serviços/Services";

const cardData = [
  {
    title: "Home",
    value: "\ud83c\udfe0",
    description: "Página inicial",
    dropdownItems: [
      "Navbar",
      "Hero Home",
      "About Us",
      "Brands",
      "Separador",
      "Soluções",
      "Testimonial",
      "Newsletter",
      "Footer",
    ],
  },
  {
    title: "Sobre",
    value: "\u2139\ufe0f",
    description: "Sobre Nós",
    dropdownItems: [
      "Navbar",
      "Hero Sobre",
      "Nossa História",
      "Nossa Visão",
      "O Que Fazemos",
      "Connects",
      "Footer",
    ],
  },
  {
    title: "Contacto",
    value: "\ud83d\udcde",
    description: "Contacte-nos",
    dropdownItems: ["Navbar", "Hero Contacto", "Contacto", "Footer"],
  },
  {
    title: "Serviços",
    value: "\ud83c\udff0",
    description: "Nossos Serviços",
    dropdownItems: ["Navbar", "Hero Serviços", "Services", "Footer"],
  },
];

const Pages = () => {
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [visibleComponent, setVisibleComponent] = useState(null);

  const toggleDropdown = (index) => {
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  const handleItemClick = (item) => {
    setVisibleComponent(item);
  };

  const handleVoltar = () => {
    setVisibleComponent(null);
    setActiveDropdown(null);
  };

  return (
    <div className="min-h-screen bg-white p-8 flex flex-col items-center justify-start gap-10">
      {!visibleComponent && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
          {cardData.map((card, index) => (
            <div
              key={index}
              className="relative bg-gray-100 rounded-2xl shadow-lg p-6 text-black transition duration-200 hover:scale-[1.02]"
            >
              <div onClick={() => toggleDropdown(index)} className="cursor-pointer">
                <h3 className="text-lg font-semibold mb-2">{card.title}</h3>
                <p className="text-4xl font-bold">{card.value}</p>
                <p className="text-sm mt-1">{card.description}</p>
              </div>
              {card.dropdownItems && activeDropdown === index && (
                <ul className="absolute top-full left-0 mt-2 bg-white text-black rounded-xl shadow-lg w-full z-10 overflow-hidden">
                  {card.dropdownItems.map((item, i) => (
                    <li
                      key={i}
                      onClick={() => handleItemClick(item)}
                      className="px-4 py-2 text-sm cursor-pointer hover:bg-gray-200"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      {visibleComponent && (
        <div className="w-full max-w-6xl border rounded-lg shadow-md p-4 bg-white flex flex-col items-start gap-6">
          <button
            onClick={handleVoltar}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-sm rounded font-medium"
          >
            ← Voltar
          </button>

          {visibleComponent === "Navbar" && <Navbar previewMode={true} />}
          {visibleComponent === "Hero Home" && <HeroHome />}
          {visibleComponent === "Hero Sobre" && <HeroSobre />}
          {visibleComponent === "Hero Contacto" && <HeroContacto adminMode={true} />}
          {visibleComponent === "Contacto" && <Contacto adminMode={true} />}
          {visibleComponent === "Hero Serviços" && <HeroServiços />}
          {visibleComponent === "Services" && <Services adminMode={true} />}
          {visibleComponent === "About Us" && <AboutUs />}
          {visibleComponent === "Brands" && <Brands adminMode={true} />}
          {visibleComponent === "Separador" && <Separador adminMode={true} />}
          {visibleComponent === "Soluções" && <Solucoes adminMode={true} />}
          {visibleComponent === "Testimonial" && <Testimonial adminMode={true} />}
          {visibleComponent === "Newsletter" && <Newsletter adminMode={true} />}
          {visibleComponent === "Footer" && <Footer adminMode={true} />}
          {visibleComponent === "Nossa História" && <Nossahistoria adminMode={true} />}
          {visibleComponent === "Nossa Visão" && <NossaVisao adminMode={true} />}
          {visibleComponent === "O Que Fazemos" && <Oquefazemos adminMode={true} />}
          {visibleComponent === "Connects" && <Connects adminMode={true} />}

          {![
            "Navbar", "Hero Home", "Hero Sobre", "Hero Contacto", "Contacto", "Hero Serviços",
            "Services", "About Us", "Brands", "Separador", "Soluções", "Testimonial", "Newsletter", "Footer",
            "Nossa História", "Nossa Visão", "O Que Fazemos", "Connects"
          ].includes(visibleComponent) && (
            <div className="w-full">
              <h2 className="text-xl font-semibold mb-4">
                Componente "{visibleComponent}"
              </h2>
              <p className="text-gray-600">Componente ainda não implementado.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Pages;
