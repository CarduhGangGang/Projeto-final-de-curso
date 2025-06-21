import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import servicosImage from "../../assets/serviços.jpg"; 

const Hero = () => {
  return (
    <motion.section
      className="bg-gray-50 px-20 py-20 md:py-30"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 mt-4">
        <div className="w-full md:w-1/2 h-60 md:h-auto order-2 md:order-1 relative rounded-2xl shadow-lg overflow-hidden">
          <img src={servicosImage} alt="Serviços" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-opacity-30"></div>
        </div>

        <div className="w-full md:w-1/2 text-center md:text-left order-1 md:order-2">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Serviços</h1>
          <p className="text-sm text-gray-500 mb-6">
            <Link to="/" className="text-white-600 hover:underline">    
              Home
            </Link>{" "}
            / Serviços
          </p>
        </div>
      </div>
    </motion.section>
  );
};

export default Hero;
