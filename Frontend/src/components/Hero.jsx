import React from 'react';
import { motion } from "framer-motion";
import heroImage from '../assets/heroImage.png';

const Hero = ({ onOrcamentoClick }) => {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat px-4 sm:px-6 lg:px-16 pt-24 pb-12 md:pt-36 md:pb-20"
      style={{ backgroundImage: `url(${heroImage})` }}
    >
      <div className="bg-black/0 flex items-center justify-center h-full">
        <motion.div
          className="max-w-7xl mx-auto px-6 flex flex-col items-center text-center lg:text-left lg:items-start"
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-black mb-4 leading-snug">
            <br /><br /><br /><br />
            Adaptação total às <br />
            <span className="text-primary">suas necessidades!</span>
          </h1>
          <h2 className="text-lg sm:text-xl font-semibold text-gray-100 mb-4">
            há mais de 11 anos
          </h2>
          <p className="text-base sm:text-lg text-white mb-6 max-w-2xl">
            Desde 2014, transformamos ambientes com soluções personalizadas, unindo tradição, tecnologia e excelência.
          </p>
          <button
            onClick={onOrcamentoClick}
            className="bg-white text-black font-medium py-2.5 px-5 rounded-lg text-sm shadow-md hover:bg-gray-200 transition duration-300"
          >
            PEDIDO DE ORÇAMENTO
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
