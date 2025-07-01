import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../../supabase-client";
import { motion } from "framer-motion";

const Hero = () => {
  const [heroData, setHeroData] = useState(null);

  useEffect(() => {
    const fetchHero = async () => {
      const { data, error } = await supabase
        .from("herocontacto")
        .select("*")
        .order("created_at", { ascending: false });

      if (data && data.length > 0) {
        const final = data.find((item) => item.is_final) || data[0];
        setHeroData(final);
      }
    };

    fetchHero();
  }, []);

  if (!heroData) return null;

  return (
    <section className="bg-gray-50 px-6 md:px-20 py-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12 mt-4">

        {/* Imagem com animação da esquerda */}
        <motion.div
          className="w-full md:w-1/2 h-60 md:h-auto order-2 md:order-1 relative rounded-2xl shadow-lg overflow-hidden"
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <img
            src={heroData.imagem_url}
            alt={heroData.titulo}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-opacity-30" />
        </motion.div>

        {/* Texto com animação da direita */}
        <motion.div
          className="w-full md:w-1/2 text-center md:text-left order-1 md:order-2"
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true, amount: 0.4 }}
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            {heroData.titulo}
          </h1>
          <p className="text-sm text-gray-500 mb-6">
            <Link to="/" className="text-black hover:underline">
              Home
            </Link>{" "}
            / {heroData.descricao}
          </p>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
