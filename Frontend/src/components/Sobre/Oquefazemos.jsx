import React from 'react';
import { motion } from 'framer-motion';
import instalacaoImg from '../../assets/instalacao.png';
import assistenciaImg from '../../assets/assistencia.png';
import orcamentosImg from '../../assets/orcamentos.png';

const Oquefazemos = () => {
  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.03, transition: { duration: 0.2 } },
  };

  const cards = [
    {
      img: instalacaoImg,
      title: 'Instalação',
      text: 'Contamos com uma equipa com formação técnica especializada, e dedicada a identificar e a instalar as soluções mais eficazes para atender a cada uma das suas necessidades.',
    },
    {
      img: assistenciaImg,
      title: 'Assistência',
      text: 'A nossa assistência técnica garante respostas rápidas, eficazes e profissionais para manter os seus sistemas a funcionar sem interrupções.',
    },
    {
      img: orcamentosImg,
      title: 'Orçamentos',
      text: 'Apresentamos orçamentos detalhados, personalizados e transparentes, sempre orientados para oferecer a melhor relação custo-benefício.',
    },
  ];

  return (
    <div className="px-4 py-16 max-w-7xl mx-auto text-center">
      <p className="text-sm text-gray-600 mb-4">
        Cada cliente é <span className="italic">único</span>. Oferecemos marcas de qualidade a preços competitivos, auxiliamos na escolha das melhores soluções, com propostas vantajosas, e realizamos instalações com profissionalismo.
      </p>
      <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-12">O que fazemos?</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col h-full"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
            whileHover="hover"
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <img
              src={card.img}
              alt={card.title}
              className="rounded-lg mb-5 w-full h-56 object-cover"
            />
            <h3 className="text-xl font-semibold text-gray-800 mb-3">{card.title}</h3>
            <p className="text-gray-600 text-sm flex-grow">{card.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Oquefazemos;
