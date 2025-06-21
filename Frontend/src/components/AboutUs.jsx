import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Outside from "../assets/Outside home.jpg";

const AboutUs = () => {
  return (
    <section className="bg-gray-50 py-16 px-6 font-[Poppins]">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Left animation for image */}
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 3.8, ease: "easeInOut" }}
        >
          <img
            src={Outside}
            alt="Outdoor installation"
            className="w-full h-auto object-cover rounded-xl shadow"
          />
        </motion.div>

        {/* Right animation for text */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.8, ease: "easeInOut", delay: 0.3 }}
        >
          <p className="text-sm uppercase text-gray-500 mb-2">Sobre a empresa</p>
          <h2 className="text-4xl font-semibold text-gray-800 mb-2">
            KENTACENTRO, UNIPESSOAL, LDA
          </h2>
          <h3 className="text-5xl font-light text-gray-700 mb-6">Sobre Nós</h3>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            A KentaCentro, Unipessoal, Lda é uma empresa sediada em Viseu, dedicada à instalação de sistemas de climatização, contando com uma experiência consolidada de mais de 11 anos. Distinguimo-nos pela solidez, fiabilidade e crescimento sustentado no setor em que operamos, prestando serviços a uma vasta carteira de clientes, tanto particulares como profissionais, em diversas áreas de negócio a nível nacional.
          </p>

          <Link
            to="/sobre"
            className="text-black tracking-widest font-medium inline-flex items-center group"
          >
            VER MAIS
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;
