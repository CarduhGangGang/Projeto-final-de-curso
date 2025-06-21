import React from "react";
import Hero from "../components/Sobre/Hero";
import NossaVisao from "../components/Sobre/NossaVisao"; 
import Oquefazemos from "../components/Sobre/Oquefazemos";
import Connects from "../components/Sobre/Connects";
import Footer from "../components/Footer";
import NossaHistoria from "../components/Sobre/NossaHistoria";


const Sobre = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
      <Hero />
      <NossaHistoria />
      <NossaVisao /> 
      <Oquefazemos />
      <Connects />
      </main>
      <Footer />
    </div>
  );
};

export default Sobre;
