import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "../../supabase-client";
import * as LucideIcons from "lucide-react";

const cardVariants = {
  hidden: { opacity: 0, scale: 0.9, y: 30 },
  visible: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      delay: i * 0.2,
      duration: 1.8,
      ease: "easeOut",
    },
  }),
};

const initialVariants = {
  hiddenLeft: { opacity: 0, x: -100 },
  visibleLeft: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut" },
  },
  hiddenRight: { opacity: 0, x: 100 },
  visibleRight: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.7, ease: "easeOut", delay: 0.3 },
  },
};

const Solucoes = () => {
  const [intro, setIntro] = useState({ titulo: "", subtitulo: "", img_url: "" });
  const [solucoes, setSolucoes] = useState([]);

  useEffect(() => {
    const fetchIntro = async () => {
      const { data, error } = await supabase
        .from("solucoes_intro")
        .select("titulo, subtitulo, img_url")
        .limit(1)
        .single();

      if (!error && data) setIntro(data);
    };

    const fetchSolucoes = async () => {
      const { data, error } = await supabase
        .from("solucoes_home")
        .select("*")
        .order("ordem", { ascending: true });

      if (!error && data) setSolucoes(data);
    };

    fetchIntro();
    fetchSolucoes();
  }, []);

  return (
    <section className="bg-white px-6 py-12 space-y-16">
      {/* Bloco inicial com animações */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-10">
        <motion.div
          className="w-full md:w-1/2"
          initial="hiddenLeft"
          animate="visibleLeft"
          variants={initialVariants}
        >
          <img
            src={intro.img_url || "https://via.placeholder.com/600x400"}
            alt="Ilustração de soluções"
            className="rounded-lg shadow-lg w-full object-cover"
          />
        </motion.div>

        <motion.div
          className="w-full md:w-1/2 text-center md:text-left"
          initial="hiddenRight"
          animate="visibleRight"
          variants={initialVariants}
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-4">
            {intro.titulo}
          </h2>
          <p className="text-sm text-gray-500">{intro.subtitulo}</p>
        </motion.div>
      </div>

      {/* Cartões dinâmicos a partir da tabela solucoes_home */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {solucoes.map((s, index) => {
          const Icon = LucideIcons[s.icone] || LucideIcons.CircleHelp;
          return (
            <motion.div
              key={s.id}
              className="bg-white rounded-2xl shadow-md p-6 text-center"
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              custom={index}
            >
              {s.image_url && (
                <img
                  src={s.image_url}
                  alt={s.titulo}
                  className="mx-auto mb-3 rounded w-16 h-16 object-cover"
                />
              )}
              <Icon className="mx-auto text-black w-8 h-8 mb-4" />
              <h3 className="text-lg font-semibold text-black mb-2">
                {s.titulo}
              </h3>
              <p className="text-sm text-gray-700">{s.descricao}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default Solucoes;
