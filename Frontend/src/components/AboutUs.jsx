import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../../supabase-client";
import { motion } from "framer-motion";

const AboutUs = () => {
  const [aboutData, setAboutData] = useState(null);

  useEffect(() => {
    const fetchAbout = async () => {
      const { data, error } = await supabase
        .from("about_us")
        .select("*")
        .eq("is_main", true)
        .single();

      if (!error) {
        setAboutData(data);
      } else {
        console.error("Erro ao buscar dados do Supabase:", error.message);
      }
    };

    fetchAbout();
  }, []);

  if (!aboutData) return null;

  return (
    <section className="bg-gray-50 py-20 px-6 font-[Poppins]">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        {/* Imagem animada ao scroll */}
        <motion.div
          initial={{ opacity: 0, x: -100, scale: 0.9 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <img
            src={aboutData.image_url}
            alt="Imagem sobre"
            className="w-full h-auto object-cover rounded-xl shadow-xl"
          />
        </motion.div>

        {/* Texto com animações em scroll */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            visible: {
              transition: {
                staggerChildren: 0.25,
              },
            },
            hidden: {},
          }}
        >
          <motion.p
            className="text-sm uppercase text-gray-500 mb-2"
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6 }}
          >
            {aboutData.title}
          </motion.p>

          <motion.h2
            className="text-4xl font-semibold text-gray-800 mb-2"
            variants={{
              hidden: { opacity: 0, x: 60 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{ duration: 0.7 }}
          >
            {aboutData.subtitle}
          </motion.h2>

          <motion.h3
            className="text-5xl font-light text-gray-700 mb-6"
            variants={{
              hidden: { opacity: 0, x: -60 },
              visible: { opacity: 1, x: 0 },
            }}
            transition={{ duration: 0.7 }}
          >
            Sobre Nós
          </motion.h3>

          <motion.p
            className="text-gray-600 text-lg leading-relaxed mb-6"
            variants={{
              hidden: { opacity: 0, y: 30 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.8 }}
          >
            {aboutData.description}
          </motion.p>

          <motion.div
            variants={{
              hidden: { opacity: 0, scale: 0.9 },
              visible: { opacity: 1, scale: 1 },
            }}
            transition={{ duration: 0.6 }}
          >
            <Link
              to="/sobre"
              className="text-black tracking-widest font-medium inline-flex items-center group"
            >
              VER MAIS
              <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;
