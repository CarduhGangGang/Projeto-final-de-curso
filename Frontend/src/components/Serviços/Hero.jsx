import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import servicosImage from "../../assets/serviços.jpg";

const Hero = () => {
  return (
    <section className="bg-gray-50 px-6 md:px-20 py-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 mt-4">
        
        {/* Imagem com animação ao entrar na viewport */}
        <motion.div
          className="w-full md:w-1/2 h-60 md:h-auto order-2 md:order-1 relative rounded-2xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <img src={servicosImage} alt="Serviços" className="w-full h-full object-cover" />
        </motion.div>

        {/* Texto com animação ao entrar na viewport */}
        <motion.div
          className="w-full md:w-1/2 text-center md:text-left order-1 md:order-2"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Serviços</h1>
          <p className="text-sm text-gray-500 mb-6">
            <Link to="/" className="text-black hover:underline">
              Home
            </Link>{" "}
            / Serviços
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
