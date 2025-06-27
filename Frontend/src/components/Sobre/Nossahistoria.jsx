import React from "react";
import { motion } from "framer-motion";

const Nossahistoria = () => {
  return (
    <section className="bg-white px-6 py-16 md:py-24 text-center">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <p className="text-sm text-gray-500 mb-2">Sobre a empresa</p>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
          KENTACENTRO, UNIPESSOAL, LDA
        </h1>
        <p className="text-gray-700 text-base mb-4">
          A KentaCentro, Unipessoal, Lda, sediada em Viseu, é uma empresa com mais de 11 anos de experiência especializada na instalação de sistemas de climatização. Consolidada e em contínuo crescimento, destacamo-nos pela excelência no setor, prestando serviços a clientes particulares e profissionais de diversas áreas em todo o território nacional.
        </p>
        <p className="text-gray-700 text-base mb-4">
          Valorizamos a representação e instalação de marcas reconhecidas, oferecendo soluções técnicas inovadoras e de elevada qualidade que promovem conforto e segurança no dia a dia dos seus utilizadores — seja em residências, locais de trabalho ou espaços de lazer.
        </p>
        <p className="text-gray-700 text-base">
          Guiados por uma cultura centrada no contacto direto e personalizado com o cliente, assumimos um compromisso inabalável com a excelência no atendimento e na prestação de serviços. A nossa abordagem diferenciada e focada nas necessidades específicas de cada cliente visa garantir a sua total satisfação. Trabalhamos com rigor, profissionalismo e espírito de equipa, transmitindo segurança e confiança através da seriedade das soluções apresentadas e da qualidade inquestionável dos nossos serviços.
        </p>
      </motion.div>
    </section>
  );
};

export default Nossahistoria;
