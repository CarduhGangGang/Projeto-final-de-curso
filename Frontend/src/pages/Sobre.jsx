import React from "react";
import Hero from "../components/Sobre/Hero";
import Nossahistoria from "../components/Sobre/NossaHistoria";
import NossaVisao from "../components/Sobre/NossaVisao"; 
import Oquefazemos from "../components/Sobre/Oquefazemos";
import Connects from "../components/Sobre/Connects";
import Footer from "../components/Footer";

const Sobre = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
      <Hero />
      <Nossahistoria />
      <NossaVisao /> 
      <Oquefazemos />
      <Connects />
      </main>
      <Footer />
    </div>
  );
};

export default Sobre;
