import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const visaoItems = [
  {
    title: "Superar as expectativas dos nossos clientes",
    content:
      "Buscamos constantemente superar as expectativas dos nossos clientes, garantindo produtos e serviços de alto padrão, com atenção ao detalhe e melhoria contínua.",
  },
  {
    title: "Atuar com honestidade e comunicação clara",
    content:
      "Atuamos com honestidade em todas as nossas relações, mantendo uma comunicação clara, ética e aberta com colaboradores, parceiros e clientes.",
  },
  {
    title: "Criatividade e soluções inovadoras",
    content:
      "Valorizamos a criatividade e a capacidade de adaptação, promovendo soluções inovadoras que acompanham as necessidades do mercado e fortalecem a nossa posição de liderança.",
  },
  {
    title: "Cliente no centro de tudo o que fazemos",
    content:
      "Colocamos o cliente no centro de tudo o que fazemos, ouvindo com atenção, respondendo com agilidade e construindo relações baseadas na confiança e satisfação duradoura.",
  },
];

const NossaVisao = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const toggleItem = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section
      className="relative py-25 px-4 md:px-6 bg-gray-50"
    >
      <motion.div
        className="max-w-3xl mx-auto z-10 relative"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h2 className="text-4xl md:text-5xl font-light text-gray-900 mb-12 text-center">
          <span className="font-semibold">A Nossa Visão</span>
        </h2>

        <div className="space-y-6">
          {visaoItems.map((item, index) => (
            <motion.div
              key={index}
              className="bg-white bg-opacity-90 backdrop-blur-md border border-gray-200 rounded-xl shadow-md overflow-hidden"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <button
                className="w-full text-left px-6 py-4 flex items-center justify-between hover:bg-gray-100 transition"
                onClick={() => toggleItem(index)}
              >
                <span className="text-gray-800 font-medium">{item.title}</span>
                <motion.span
                  animate={{ rotate: activeIndex === index ? 90 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="text-xl text-black"
                >
                  ▶
                </motion.span>
              </button>

              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="px-6 pb-4 text-gray-700"
                  >
                    <div className="mt-2 border-t border-gray-200 pt-4">
                      {item.content}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default NossaVisao;
