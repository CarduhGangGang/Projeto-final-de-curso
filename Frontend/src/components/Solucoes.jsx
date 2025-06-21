import React from "react";
import Businessman from "../assets/businessman-relaxing-office.jpg";
import { Home, Headphones, Calculator } from "lucide-react";
import { motion } from "framer-motion";

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
            src={Businessman}
            alt="Homem relaxando no escritório com ar-condicionado"
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
            As melhores soluções de equipamentos técnicos de conforto para o seu
            lar, local de trabalho ou de lazer.
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            As nossas propostas para o seu conforto diário
          </p>
          
        </motion.div>
      </div>

       {/* Cartões de serviço animados e responsivos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[ 
          {
            Icon: Home,
            title: "Instalação",
            description:
              "Contamos com uma equipa com formação técnica especializada, e dedicada a identificar e a instalar as soluções mais eficazes para atender a cada uma das suas necessidades, seja em obra nova, ou em remodelação do mais simples ao mais complexo.",
          },
          {
            Icon: Headphones,
            title: "Assistência",
            description:
              "Fornecemos suporte técnico permanente dentro e fora de período de garantia, manutenção preventiva e reparação urgente em todos os sistemas técnicos instalados pela Kentacentro. Os nossos clientes têm sempre total prioridade.",
          },
          {
            Icon: Calculator,
            title: "Orçamentos",
            description:
              "Se procura auxílio na escolha dos produtos ou soluções ideais para os seus projetos e obras novas, ou de remodelação, solicite-nos uma proposta, e teremos todo o gosto em fornecer-lhe apoio e em preparar-lhe as melhores soluções.",
          },
        ].map(({ Icon, title, description }, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-2xl shadow-md p-6 text-center"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            custom={index}
          >
            <Icon className="mx-auto text-black w-8 h-8 mb-4" />
            <h3 className="text-lg font-semibold text-black mb-2">{title}</h3>
            <p className="text-sm text-gray-700">{description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Solucoes;